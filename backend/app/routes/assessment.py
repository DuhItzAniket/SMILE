from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.models.database import ChildRecord
from app.services.prediction import predict_risk
from app.services.vision import analyze_image
from app.utils.auth import require_role
from app.utils.database import get_db
import tempfile
import os
import json

router = APIRouter()

@router.post("/unified-assessment")
async def unified_assessment(
    child_id: str = Form(...),
    child_name: str = Form(...),
    age_months: int = Form(...),
    gender: str = Form(...),
    district: str = Form(None),
    mandal: str = Form(None),
    awc_code: str = Form(None),
    assessment_data: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    try:
        ml_prediction = None
        ml_confidence = None
        vision_result = None
        temp_path = None
        
        assessment_dict = {}
        if assessment_data:
            try:
                assessment_dict = json.loads(assessment_data)
            except:
                pass
        
        if assessment_dict:
            full_data = {
                'child_id': child_id,
                'child_name': child_name,
                'age_months': age_months,
                'gender': gender,
                'district': district,
                'mandal': mandal,
                'awc_code': awc_code,
                **assessment_dict
            }
            try:
                ml_prediction, ml_confidence = predict_risk(full_data)
            except Exception as e:
                print(f"ML prediction error: {e}")
        
        if image and image.filename:
            try:
                content = await image.read()
                suffix = os.path.splitext(image.filename)[1] or ".jpg"
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, mode='wb') as tmp:
                    tmp.write(content)
                    temp_path = tmp.name
                
                vision_result = analyze_image(temp_path)
            except Exception as e:
                print(f"Vision analysis error: {e}")
            finally:
                if temp_path and os.path.exists(temp_path):
                    os.remove(temp_path)
        
        child_record = ChildRecord(
            child_id=child_id,
            child_name=child_name,
            age_months=age_months,
            gender=gender,
            district=district,
            mandal=mandal,
            awc_code=awc_code,
            user_id=current_user.get("user_id"),
            prediction=ml_prediction,
            confidence_scores=json.dumps(ml_confidence) if ml_confidence else None,
            **assessment_dict
        )
        
        if vision_result:
            child_record.vision_emotion = vision_result.get('emotion', {}).get('emotion')
            child_record.vision_emotion_confidence = vision_result.get('emotion', {}).get('confidence')
            child_record.vision_pose_detected = 1 if vision_result.get('pose', {}).get('pose_detected') else 0
            child_record.vision_posture_score = vision_result.get('pose', {}).get('posture_score')
            child_record.vision_balance_score = vision_result.get('pose', {}).get('balance_score')
            child_record.vision_activity_level = vision_result.get('pose', {}).get('activity_level')
            child_record.vision_overall_score = vision_result.get('overall_score')
        
        db.add(child_record)
        db.commit()
        db.refresh(child_record)
        
        return {
            "record_id": child_record.id,
            "child_id": child_id,
            "child_name": child_name,
            "ml_prediction": {"predicted_category": ml_prediction, "confidence": ml_confidence} if ml_prediction else None,
            "vision_analysis": vision_result,
            "message": "Assessment completed successfully"
        }
        
    except Exception as e:
        import traceback
        print(f"Unified assessment error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/assessments")
def get_all_assessments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"])),
    skip: int = 0,
    limit: int = 100
):
    records = db.query(ChildRecord).order_by(ChildRecord.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for record in records:
        result.append({
            "id": record.id,
            "child_id": record.child_id,
            "child_name": record.child_name,
            "age_months": record.age_months,
            "gender": record.gender,
            "prediction": record.prediction,
            "vision_emotion": record.vision_emotion,
            "vision_overall_score": record.vision_overall_score,
            "created_at": record.created_at.isoformat() if record.created_at else None,
            "has_assessment": record.prediction is not None,
            "has_vision": record.vision_emotion is not None
        })
    
    return result

@router.get("/assessments/child/{child_id}")
def get_child_assessments(
    child_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    records = db.query(ChildRecord).filter(ChildRecord.child_id == child_id).order_by(ChildRecord.created_at.desc()).all()
    
    result = []
    for record in records:
        result.append({
            "id": record.id,
            "child_id": record.child_id,
            "child_name": record.child_name,
            "age_months": record.age_months,
            "gender": record.gender,
            "prediction": record.prediction,
            "vision_emotion": record.vision_emotion,
            "vision_overall_score": record.vision_overall_score,
            "created_at": record.created_at.isoformat() if record.created_at else None,
            "has_assessment": record.prediction is not None,
            "has_vision": record.vision_emotion is not None
        })
    
    return result

@router.get("/assessments/{record_id}")
def get_assessment_details(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    record = db.query(ChildRecord).filter(ChildRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    confidence = None
    if record.confidence_scores:
        try:
            confidence = json.loads(record.confidence_scores)
        except:
            pass
    
    return {
        "id": record.id,
        "child_id": record.child_id,
        "child_name": record.child_name,
        "age_months": record.age_months,
        "gender": record.gender,
        "district": record.district,
        "mandal": record.mandal,
        "awc_code": record.awc_code,
        "prediction": record.prediction,
        "confidence": confidence,
        "vision_emotion": record.vision_emotion,
        "vision_emotion_confidence": record.vision_emotion_confidence,
        "vision_pose_detected": record.vision_pose_detected,
        "vision_posture_score": record.vision_posture_score,
        "vision_balance_score": record.vision_balance_score,
        "vision_activity_level": record.vision_activity_level,
        "vision_overall_score": record.vision_overall_score,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "has_assessment": record.prediction is not None,
        "has_vision": record.vision_emotion is not None
    }

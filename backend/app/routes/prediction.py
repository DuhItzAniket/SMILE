from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.schemas.schemas import ChildDataInput, PredictionResponse, ImageAnalysisResponse
from app.models.database import ChildRecord
from app.services.prediction import predict_risk
from app.services.vision import analyze_image
from app.utils.auth import get_current_user, require_role
from app.utils.database import get_db
import tempfile
import os

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(
    data: ChildDataInput,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    """
    Predict developmental risk for a child
    """
    try:
        prediction = None
        confidence = None
        
        # Only run ML prediction if assessment data is provided
        # Check if at least some assessment fields are filled
        has_assessment_data = any([
            data.GM_delay is not None,
            data.FM_delay is not None,
            data.nutrition_score is not None,
            data.GM_DQ is not None
        ])
        
        if has_assessment_data:
            # Predict
            prediction, confidence = predict_risk(data.dict())
        
        # Save to database
        child_record = ChildRecord(
            **data.dict(),
            prediction=prediction,
            user_id=current_user.get("user_id")
        )
        db.add(child_record)
        db.commit()
        db.refresh(child_record)
        
        return {
            "prediction": prediction,
            "record_id": child_record.id,
            "confidence": confidence
        }
    except Exception as e:
        import traceback
        print(f"Prediction error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-image")
async def analyze_image_endpoint(
    image: UploadFile = File(...),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    """
    Analyze child image for emotion and pose
    """
    temp_path = None
    try:
        # Validate file type
        if not image.content_type or not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image (PNG, JPG, JPEG)")
        
        # Read image content
        content = await image.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Save temporarily
        suffix = os.path.splitext(image.filename)[1] or ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, mode='wb') as tmp:
            tmp.write(content)
            temp_path = tmp.name
        
        # Analyze image
        result = analyze_image(temp_path)
        
        # Return as plain dict (no Pydantic validation)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"Analysis failed: {str(e)}"
        print(f"[ERROR] Vision analysis failed:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_detail)
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

@router.get("/records")
def get_records(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["SUPERVISOR", "ADMIN"])),
    skip: int = 0,
    limit: int = 100
):
    """
    Get all child records (for dashboard)
    """
    records = db.query(ChildRecord).offset(skip).limit(limit).all()
    return records

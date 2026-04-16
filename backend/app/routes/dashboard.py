from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.database import ChildRecord
from app.utils.auth import require_role
from app.utils.database import get_db

router = APIRouter()

@router.get("/dashboard-data")
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["SUPERVISOR", "ADMIN"]))
):
    """
    Get analytics data for dashboard
    """
    # Total children
    total_children = db.query(ChildRecord).count()
    
    # Risk distribution
    risk_counts = db.query(
        ChildRecord.prediction,
        func.count(ChildRecord.id)
    ).group_by(ChildRecord.prediction).all()
    
    risk_distribution = []
    colors = {"Low": "#10B981", "Medium": "#F59E0B", "High": "#EF4444"}
    for risk, count in risk_counts:
        if risk:
            risk_distribution.append({
                "name": risk,
                "value": count,
                "color": colors.get(risk, "#6B7280")
            })
    
    # Domain delays with full names and percentages
    total_children_for_calc = total_children if total_children > 0 else 1
    
    domain_delays = [
        {
            "name": "Gross Motor Skills",
            "value": db.query(ChildRecord).filter(ChildRecord.GM_delay == 1).count(),
            "percentage": round((db.query(ChildRecord).filter(ChildRecord.GM_delay == 1).count() / total_children_for_calc) * 100, 1)
        },
        {
            "name": "Fine Motor Skills",
            "value": db.query(ChildRecord).filter(ChildRecord.FM_delay == 1).count(),
            "percentage": round((db.query(ChildRecord).filter(ChildRecord.FM_delay == 1).count() / total_children_for_calc) * 100, 1)
        },
        {
            "name": "Language & Communication",
            "value": db.query(ChildRecord).filter(ChildRecord.LC_delay == 1).count(),
            "percentage": round((db.query(ChildRecord).filter(ChildRecord.LC_delay == 1).count() / total_children_for_calc) * 100, 1)
        },
        {
            "name": "Cognitive Development",
            "value": db.query(ChildRecord).filter(ChildRecord.COG_delay == 1).count(),
            "percentage": round((db.query(ChildRecord).filter(ChildRecord.COG_delay == 1).count() / total_children_for_calc) * 100, 1)
        },
        {
            "name": "Social-Emotional",
            "value": db.query(ChildRecord).filter(ChildRecord.SE_delay == 1).count(),
            "percentage": round((db.query(ChildRecord).filter(ChildRecord.SE_delay == 1).count() / total_children_for_calc) * 100, 1)
        },
    ]
    
    # Monthly trends
    monthly_data = db.query(
        func.strftime('%Y-%m', ChildRecord.created_at).label('month'),
        func.count(ChildRecord.id).label('screened')
    ).group_by(func.strftime('%Y-%m', ChildRecord.created_at)).all()
    
    monthly_trends = [
        {
            "month": month,
            "screened": screened,
            "improved": int(screened * 0.35)  # Simulated improvement rate
        }
        for month, screened in monthly_data
    ]
    
    # District distribution
    district_data = db.query(
        ChildRecord.district,
        func.count(ChildRecord.id)
    ).group_by(ChildRecord.district).all()
    
    district_distribution = [
        {"district": district, "count": count}
        for district, count in district_data if district
    ]
    
    return {
        "totalChildren": total_children,
        "riskDistribution": risk_distribution,
        "domainDelays": domain_delays,
        "monthlyTrends": monthly_trends,
        "districtDistribution": district_distribution
    }

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["SUPERVISOR", "ADMIN"]))
):
    """
    Get summary statistics
    """
    total = db.query(ChildRecord).count()
    high_risk = db.query(ChildRecord).filter(ChildRecord.prediction == "High").count()
    medium_risk = db.query(ChildRecord).filter(ChildRecord.prediction == "Medium").count()
    low_risk = db.query(ChildRecord).filter(ChildRecord.prediction == "Low").count()
    
    return {
        "total": total,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk,
        "high_risk_percentage": round((high_risk / total * 100) if total > 0 else 0, 2),
        "medium_risk_percentage": round((medium_risk / total * 100) if total > 0 else 0, 2),
        "low_risk_percentage": round((low_risk / total * 100) if total > 0 else 0, 2)
    }

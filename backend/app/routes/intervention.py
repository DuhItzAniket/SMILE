from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.schemas import InterventionCreate, InterventionResponse, FollowUpCreate, FollowUpResponse
from app.models.database import Intervention, FollowUp
from app.utils.auth import require_role
from app.utils.database import get_db
from typing import List

router = APIRouter()

@router.post("/interventions", response_model=InterventionResponse)
def create_intervention(
    data: InterventionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    """
    Create intervention for a child
    """
    intervention = Intervention(**data.dict())
    db.add(intervention)
    db.commit()
    db.refresh(intervention)
    return intervention

@router.get("/interventions/{child_record_id}", response_model=List[InterventionResponse])
def get_interventions(
    child_record_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    """
    Get all interventions for a child
    """
    interventions = db.query(Intervention).filter(
        Intervention.child_record_id == child_record_id
    ).all()
    return interventions

@router.post("/follow-ups", response_model=FollowUpResponse)
def create_follow_up(
    data: FollowUpCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    """
    Record follow-up assessment
    """
    follow_up = FollowUp(**data.dict())
    db.add(follow_up)
    db.commit()
    db.refresh(follow_up)
    return follow_up

@router.get("/follow-ups/{child_record_id}", response_model=List[FollowUpResponse])
def get_follow_ups(
    child_record_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["AWW", "SUPERVISOR", "ADMIN"]))
):
    """
    Get all follow-ups for a child
    """
    follow_ups = db.query(FollowUp).filter(
        FollowUp.child_record_id == child_record_id
    ).all()
    return follow_ups

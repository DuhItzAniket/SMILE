from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

# ============================================
# AUTH SCHEMAS
# ============================================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str
    district: Optional[str] = None
    mandal: Optional[str] = None
    awc_code: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

# ============================================
# CHILD DATA SCHEMA
# ============================================
class ChildDataInput(BaseModel):
    # Mandatory fields
    child_id: str
    child_name: str
    age_months: int
    gender: str
    
    # Optional fields
    district: Optional[str] = None
    mandal: Optional[str] = None
    awc_code: Optional[str] = None
    
    GM_delay: Optional[int] = None
    FM_delay: Optional[int] = None
    LC_delay: Optional[int] = None
    COG_delay: Optional[int] = None
    SE_delay: Optional[int] = None
    num_delays: Optional[int] = None
    
    autism_risk: Optional[str] = None
    adhd_risk: Optional[str] = None
    behavior_risk: Optional[str] = None
    
    underweight: Optional[int] = None
    stunting: Optional[int] = None
    wasting: Optional[int] = None
    anemia: Optional[int] = None
    nutrition_score: Optional[float] = None
    nutrition_risk: Optional[str] = None
    
    parent_child_interaction_score: Optional[float] = None
    parent_mental_health_score: Optional[float] = None
    home_stimulation_score: Optional[float] = None
    play_materials: Optional[str] = None
    caregiver_engagement: Optional[str] = None
    language_exposure: Optional[str] = None
    safe_water: Optional[str] = None
    toilet_facility: Optional[str] = None
    
    mode_delivery: Optional[str] = None
    mode_conception: Optional[str] = None
    birth_status: Optional[str] = None
    consanguinity: Optional[str] = None
    GM_DQ: Optional[float] = None
    FM_DQ: Optional[float] = None
    LC_DQ: Optional[float] = None
    COG_DQ: Optional[float] = None
    SE_DQ: Optional[float] = None
    Composite_DQ: Optional[float] = 90.0
    
    behaviour_score: Optional[float] = 70.0
    
    @validator('GM_delay', 'FM_delay', 'LC_delay', 'COG_delay', 'SE_delay')
    def validate_delay(cls, v):
        if v is not None and v not in [0, 1]:
            raise ValueError('Delay fields must be 0 or 1')
        return v
    
    @validator('underweight', 'stunting', 'wasting', 'anemia')
    def validate_binary(cls, v):
        if v is not None and v not in [0, 1]:
            raise ValueError('Binary fields must be 0 or 1')
        return v

class PredictionResponse(BaseModel):
    prediction: Optional[str] = None
    record_id: int
    confidence: Optional[dict] = None
    vision_analysis: Optional[dict] = None

# ============================================
# INTERVENTION SCHEMAS
# ============================================
class InterventionCreate(BaseModel):
    child_record_id: int
    intervention_type: str
    description: str
    status: str = "planned"

class InterventionResponse(BaseModel):
    id: int
    child_record_id: int
    intervention_type: str
    description: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============================================
# FOLLOW-UP SCHEMAS
# ============================================
class FollowUpCreate(BaseModel):
    child_record_id: int
    follow_up_date: datetime
    assessment_result: str
    notes: str = ""

class FollowUpResponse(BaseModel):
    id: int
    child_record_id: int
    follow_up_date: datetime
    assessment_result: str
    notes: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============================================
# IMAGE ANALYSIS SCHEMAS
# ============================================
class ImageAnalysisResponse(BaseModel):
    emotion: dict
    pose: dict
    facial_features: dict
    overall_score: int
    recommendations: list
    
    class Config:
        from_attributes = True

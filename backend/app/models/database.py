from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # AWW, SUPERVISOR, ADMIN
    district = Column(String(100))
    mandal = Column(String(100))
    awc_code = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("ChildRecord", back_populates="user")

class ChildRecord(Base):
    __tablename__ = "child_records"
    
    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(String(50), index=True, nullable=False)
    child_name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Registration (Mandatory)
    age_months = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    district = Column(String(100))
    mandal = Column(String(100))
    awc_code = Column(String(50))
    
    # Developmental Risk (Optional)
    GM_delay = Column(Integer, nullable=True)
    FM_delay = Column(Integer, nullable=True)
    LC_delay = Column(Integer, nullable=True)
    COG_delay = Column(Integer, nullable=True)
    SE_delay = Column(Integer, nullable=True)
    num_delays = Column(Integer, nullable=True)
    
    # Neuro-Behavioral (Optional)
    autism_risk = Column(String(20), nullable=True)
    adhd_risk = Column(String(20), nullable=True)
    behavior_risk = Column(String(20), nullable=True)
    
    # Nutrition (Optional)
    underweight = Column(Integer, nullable=True)
    stunting = Column(Integer, nullable=True)
    wasting = Column(Integer, nullable=True)
    anemia = Column(Integer, nullable=True)
    nutrition_score = Column(Float, nullable=True)
    nutrition_risk = Column(String(20), nullable=True)
    
    # Environment (Optional)
    parent_child_interaction_score = Column(Float, nullable=True)
    parent_mental_health_score = Column(Float, nullable=True)
    home_stimulation_score = Column(Float, nullable=True)
    play_materials = Column(String(20), nullable=True)
    caregiver_engagement = Column(String(20), nullable=True)
    language_exposure = Column(String(20), nullable=True)
    safe_water = Column(String(20), nullable=True)
    toilet_facility = Column(String(20), nullable=True)
    
    # Developmental Assessment (Optional)
    mode_delivery = Column(String(20), nullable=True)
    mode_conception = Column(String(20), nullable=True)
    birth_status = Column(String(20), nullable=True)
    consanguinity = Column(String(20), nullable=True)
    GM_DQ = Column(Float, nullable=True)
    FM_DQ = Column(Float, nullable=True)
    LC_DQ = Column(Float, nullable=True)
    COG_DQ = Column(Float, nullable=True)
    SE_DQ = Column(Float, nullable=True)
    Composite_DQ = Column(Float, nullable=True)
    
    # Behaviour (Optional)
    behaviour_score = Column(Float, nullable=True)
    
    # ML Prediction (Optional)
    prediction = Column(String(20), nullable=True)
    confidence_scores = Column(Text, nullable=True)  # JSON string
    
    # Vision Analysis (Optional)
    vision_emotion = Column(String(20), nullable=True)
    vision_emotion_confidence = Column(Float, nullable=True)
    vision_pose_detected = Column(Integer, nullable=True)  # 0 or 1
    vision_posture_score = Column(Float, nullable=True)
    vision_balance_score = Column(Float, nullable=True)
    vision_activity_level = Column(String(20), nullable=True)
    vision_overall_score = Column(Integer, nullable=True)
    vision_image_path = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="predictions")
    interventions = relationship("Intervention", back_populates="child")
    follow_ups = relationship("FollowUp", back_populates="child")

class Intervention(Base):
    __tablename__ = "interventions"
    
    id = Column(Integer, primary_key=True, index=True)
    child_record_id = Column(Integer, ForeignKey("child_records.id"))
    intervention_type = Column(String(100))
    description = Column(Text)
    status = Column(String(20), default="planned")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    child = relationship("ChildRecord", back_populates="interventions")

class FollowUp(Base):
    __tablename__ = "follow_ups"
    
    id = Column(Integer, primary_key=True, index=True)
    child_record_id = Column(Integer, ForeignKey("child_records.id"))
    follow_up_date = Column(DateTime)
    assessment_result = Column(String(20))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    child = relationship("ChildRecord", back_populates="follow_ups")

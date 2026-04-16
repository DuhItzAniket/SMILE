import joblib
import pandas as pd
import numpy as np
import os

# Load model artifacts
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'models', 'model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'models', 'scaler.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'models', 'label_encoder.pkl')
NUMERIC_FEATURES_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'models', 'numeric_features.pkl')
FEATURE_NAMES_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'models', 'feature_names.pkl')

model = None
scaler = None
label_encoder = None
numeric_features = None
feature_names = None

def load_artifacts():
    global model, scaler, label_encoder, numeric_features, feature_names
    if model is None:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
        numeric_features = joblib.load(NUMERIC_FEATURES_PATH)
        feature_names = joblib.load(FEATURE_NAMES_PATH)

def predict_risk(data: dict):
    """
    Predict developmental risk from child data
    """
    load_artifacts()
    
    # Convert to DataFrame
    df = pd.DataFrame([data])
    
    # Feature engineering (same as training)
    df['total_health_risk'] = df[['underweight', 'stunting', 'wasting', 'anemia']].sum(axis=1)
    df['interaction_index'] = df['parent_child_interaction_score'] + df['home_stimulation_score']
    dq_cols = ['GM_DQ', 'FM_DQ', 'LC_DQ', 'COG_DQ', 'SE_DQ']
    df['DQ_mean'] = df[dq_cols].mean(axis=1)
    df['DQ_std'] = df[dq_cols].std(axis=1)
    df['age_group'] = pd.cut(df['age_months'], bins=[0, 12, 24, 36, 48, 72], labels=['0-12', '13-24', '25-36', '37-48', '49-72'])
    
    # Select features
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    categorical_cols = [col for col in categorical_cols if col not in ['child_id']]
    
    # Convert categorical to string
    for col in categorical_cols:
        df[col] = df[col].astype(str)
    
    # One-hot encode
    X = pd.get_dummies(df[numeric_features + categorical_cols], columns=categorical_cols, drop_first=True)
    
    # Align with training features
    for col in feature_names:
        if col not in X.columns:
            X[col] = 0
    X = X[feature_names]
    
    # Scale numeric features
    X[numeric_features] = scaler.transform(X[numeric_features])
    
    # Predict
    prediction = model.predict(X)[0]
    prediction_proba = model.predict_proba(X)[0]
    
    # Decode
    result = label_encoder.inverse_transform([prediction])[0]
    
    # Confidence scores
    confidence = {
        label: float(prob) 
        for label, prob in zip(label_encoder.classes_, prediction_proba)
    }
    
    return result, confidence

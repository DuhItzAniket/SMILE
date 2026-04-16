"""
SMILE ML Training Pipeline
Trains XGBoost and Random Forest models for ECD risk prediction
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
import joblib
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("SMILE ML TRAINING PIPELINE")
print("=" * 60)

# ============================================
# STEP 1: LOAD ALL SHEETS
# ============================================
print("\n[1/8] Loading dataset sheets...")
xl = pd.ExcelFile('../dataset/ECD Data sets.xlsx')

# Load only input feature sheets (avoid leakage)
registration = pd.read_excel(xl, 'Registration')
dev_risk = pd.read_excel(xl, 'Developmental_Risk')
neuro = pd.read_excel(xl, 'Neuro_Behavioral')
nutrition = pd.read_excel(xl, 'Nutrition')
environment = pd.read_excel(xl, 'Environment_Caregiving')
dev_assessment = pd.read_excel(xl, 'Developmental_Assessment')
risk_class = pd.read_excel(xl, 'Risk_Classification')
behavior = pd.read_excel(xl, 'Behaviour_Indicators')

# Load target (baseline_category)
target_df = pd.read_excel(xl, 'Baseline_Risk_Output')[['child_id', 'baseline_category']]

print(f"[OK] Loaded {len(registration)} records from 8 input sheets + target")

# ============================================
# STEP 2: MERGE ALL TABLES
# ============================================
print("\n[2/8] Merging tables on child_id...")
df = registration.copy()
for table in [dev_risk, neuro, nutrition, environment, dev_assessment, risk_class, behavior]:
    df = df.merge(table, on='child_id', how='left')

# Merge target
df = df.merge(target_df, on='child_id', how='inner')

print(f"[OK] Merged dataset shape: {df.shape}")
print(f"[OK] Target distribution:\n{df['baseline_category'].value_counts()}")

# ============================================
# STEP 3: FEATURE ENGINEERING
# ============================================
print("\n[3/8] Engineering features...")

# Total health risk
df['total_health_risk'] = df[['underweight', 'stunting', 'wasting', 'anemia']].sum(axis=1)

# Interaction index
df['interaction_index'] = df['parent_child_interaction_score'] + df['home_stimulation_score']

# DQ mean (developmental quotient average)
dq_cols = ['GM_DQ', 'FM_DQ', 'LC_DQ', 'COG_DQ', 'SE_DQ']
df['DQ_mean'] = df[dq_cols].mean(axis=1)
df['DQ_std'] = df[dq_cols].std(axis=1)

# Age group
df['age_group'] = pd.cut(df['age_months'], bins=[0, 12, 24, 36, 48, 72], labels=['0-12', '13-24', '25-36', '37-48', '49-72'])

print(f"[OK] Created 5 derived features")

# ============================================
# STEP 4: FEATURE SELECTION
# ============================================
print("\n[4/8] Selecting features...")

# Exclude leakage columns
exclude_cols = [
    'child_id', 'baseline_category', 'baseline_score',  # Target/ID
    'dob', 'awc_code', 'assessment_cycle',  # Non-predictive
]

# Separate numeric and categorical
numeric_features = df.select_dtypes(include=[np.number]).columns.tolist()
numeric_features = [col for col in numeric_features if col not in exclude_cols]

categorical_features = df.select_dtypes(include=['object', 'category']).columns.tolist()
categorical_features = [col for col in categorical_features if col not in exclude_cols]

print(f"[OK] Numeric features: {len(numeric_features)}")
print(f"[OK] Categorical features: {len(categorical_features)}")

# ============================================
# STEP 5: PREPROCESSING
# ============================================
print("\n[5/8] Preprocessing data...")

# Handle missing values
df[numeric_features] = df[numeric_features].fillna(df[numeric_features].median())
for col in categorical_features:
    df[col] = df[col].astype(str).fillna('Unknown')

# Prepare X and y
X = df[numeric_features + categorical_features].copy()
y = df['baseline_category'].copy()

# One-hot encode categorical
X_encoded = pd.get_dummies(X, columns=categorical_features, drop_first=True)

# Encode target
le = LabelEncoder()
y_encoded = le.fit_transform(y)

print(f"[OK] Final feature count: {X_encoded.shape[1]}")
print(f"[OK] Classes: {le.classes_}")

# Scale numeric features
scaler = StandardScaler()
X_scaled = X_encoded.copy()
X_scaled[numeric_features] = scaler.fit_transform(X_encoded[numeric_features])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"[OK] Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")

# ============================================
# STEP 6: MODEL TRAINING
# ============================================
print("\n[6/8] Training models...")

# Random Forest
print("\n> Training Random Forest...")
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=4,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)
rf_acc = accuracy_score(y_test, rf_pred)
rf_f1 = f1_score(y_test, rf_pred, average='weighted')
print(f"  Accuracy: {rf_acc:.4f}")
print(f"  F1 Score: {rf_f1:.4f}")

# XGBoost
print("\n> Training XGBoost...")
xgb_model = XGBClassifier(
    n_estimators=200,
    max_depth=8,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=10,  # Handle imbalance
    random_state=42,
    eval_metric='mlogloss'
)
xgb_model.fit(X_train, y_train)
xgb_pred = xgb_model.predict(X_test)
xgb_acc = accuracy_score(y_test, xgb_pred)
xgb_f1 = f1_score(y_test, xgb_pred, average='weighted')
print(f"  Accuracy: {xgb_acc:.4f}")
print(f"  F1 Score: {xgb_f1:.4f}")

# ============================================
# STEP 7: MODEL SELECTION
# ============================================
print("\n[7/8] Selecting best model...")

if xgb_f1 >= rf_f1:
    best_model = xgb_model
    best_name = "XGBoost"
    best_pred = xgb_pred
    best_acc = xgb_acc
    best_f1 = xgb_f1
else:
    best_model = rf_model
    best_name = "Random Forest"
    best_pred = rf_pred
    best_acc = rf_acc
    best_f1 = rf_f1

print(f"[OK] Best Model: {best_name}")
print(f"  Accuracy: {best_acc:.4f}")
print(f"  F1 Score: {best_f1:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, best_pred, target_names=le.classes_))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, best_pred))

# ============================================
# STEP 8: SAVE ARTIFACTS
# ============================================
print("\n[8/8] Saving model artifacts...")

joblib.dump(best_model, 'models/model.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(le, 'models/label_encoder.pkl')
joblib.dump(numeric_features, 'models/numeric_features.pkl')
joblib.dump(X_encoded.columns.tolist(), 'models/feature_names.pkl')

print("[OK] Saved:")
print("  - models/model.pkl")
print("  - models/scaler.pkl")
print("  - models/label_encoder.pkl")
print("  - models/numeric_features.pkl")
print("  - models/feature_names.pkl")

# Save feature importance
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': X_encoded.columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    importance_df.to_csv('models/feature_importance.csv', index=False)
    print("  - models/feature_importance.csv")

print("\n" + "=" * 60)
print("[SUCCESS] TRAINING COMPLETE!")
print("=" * 60)

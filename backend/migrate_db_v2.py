"""
Database Migration Script
Adds new columns for unified assessment
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'smile.db')

def migrate():
    print("="*60)
    print("DATABASE MIGRATION - Adding New Columns")
    print("="*60)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # List of new columns to add
    new_columns = [
        ("child_name", "TEXT"),
        ("confidence_scores", "TEXT"),
        ("vision_emotion", "TEXT"),
        ("vision_emotion_confidence", "REAL"),
        ("vision_pose_detected", "INTEGER"),
        ("vision_posture_score", "REAL"),
        ("vision_balance_score", "REAL"),
        ("vision_activity_level", "TEXT"),
        ("vision_overall_score", "INTEGER"),
        ("vision_image_path", "TEXT"),
        ("updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
    ]
    
    for col_name, col_type in new_columns:
        try:
            cursor.execute(f"ALTER TABLE child_records ADD COLUMN {col_name} {col_type}")
            print(f"[OK] Added column: {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"[SKIP] Column already exists: {col_name}")
            else:
                print(f"[ERROR] Failed to add {col_name}: {e}")
    
    conn.commit()
    conn.close()
    
    print("\n" + "="*60)
    print("MIGRATION COMPLETE")
    print("="*60)

if __name__ == "__main__":
    migrate()

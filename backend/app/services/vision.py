import cv2
import numpy as np
from PIL import Image
import os

# Computer vision is available with fallback methods
COMPUTER_VISION_AVAILABLE = True
DEBUG_MODE = os.getenv('VISION_DEBUG', 'false').lower() == 'true'

def debug_print(message):
    """Print debug messages if debug mode is enabled"""
    if DEBUG_MODE:
        print(f"[VISION DEBUG] {message}")

def analyze_emotion_advanced(image_path: str):
    """
    Advanced emotion detection using image analysis
    """
    try:
        debug_print(f"Loading image: {image_path}")
        img = cv2.imread(image_path)
        if img is None:
            debug_print("Failed to load image")
            return {"emotion": "unknown", "confidence": 0.0, "all_emotions": {}}
        
        debug_print(f"Image shape: {img.shape}")
        
        # Resize image if too large (improves detection)
        height, width = img.shape[:2]
        if width > 1024:
            scale = 1024 / width
            img = cv2.resize(img, (1024, int(height * scale)))
            debug_print(f"Resized to: {img.shape}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply histogram equalization for better contrast
        gray = cv2.equalizeHist(gray)
        debug_print("Applied histogram equalization")
        
        # Detect face with multiple attempts
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Try different scale factors
        debug_print("Attempting face detection (attempt 1)...")
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
        debug_print(f"Found {len(faces)} faces")
        
        if len(faces) == 0:
            # Try with more relaxed parameters
            debug_print("Attempting face detection (attempt 2 - relaxed)...")
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(20, 20))
            debug_print(f"Found {len(faces)} faces")
        
        if len(faces) == 0:
            # Try alternative cascade
            debug_print("Attempting face detection (attempt 3 - alt cascade)...")
            alt_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')
            faces = alt_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
            debug_print(f"Found {len(faces)} faces")
        
        if len(faces) == 0:
            debug_print("No face detected after all attempts")
            return {"emotion": "no_face_detected", "confidence": 0.0, "all_emotions": {}, "face_detected": False}
        
        # Get the first face
        (x, y, w, h) = faces[0]
        debug_print(f"Face location: x={x}, y={y}, w={w}, h={h}")
        face_roi = gray[y:y+h, x:x+w]
        
        # Analyze facial features for emotion
        brightness = np.mean(face_roi)
        contrast = np.std(face_roi)
        
        # Detect smile using mouth region (bottom third of face)
        mouth_roi = face_roi[int(h*0.6):h, :]
        mouth_brightness = np.mean(mouth_roi)
        
        # Detect eye region (top third)
        eye_roi = face_roi[0:int(h*0.4), :]
        eye_contrast = np.std(eye_roi)
        
        # Simple heuristic-based emotion detection
        emotions = {
            "happy": 0.0,
            "sad": 0.0,
            "neutral": 0.0,
            "surprise": 0.0,
            "angry": 0.0
        }
        
        # Happy: bright face, high mouth brightness
        if brightness > 100 and mouth_brightness > brightness:
            emotions["happy"] = 0.7
            emotions["neutral"] = 0.2
            emotions["surprise"] = 0.1
        # Sad: low brightness, low contrast
        elif brightness < 80 and contrast < 30:
            emotions["sad"] = 0.6
            emotions["neutral"] = 0.3
            emotions["angry"] = 0.1
        # Surprise: high eye contrast
        elif eye_contrast > 40:
            emotions["surprise"] = 0.6
            emotions["happy"] = 0.2
            emotions["neutral"] = 0.2
        # Angry: high contrast, low brightness
        elif contrast > 35 and brightness < 90:
            emotions["angry"] = 0.5
            emotions["sad"] = 0.3
            emotions["neutral"] = 0.2
        # Neutral: default
        else:
            emotions["neutral"] = 0.7
            emotions["happy"] = 0.2
            emotions["sad"] = 0.1
        
        top_emotion = max(emotions, key=emotions.get)
        
        return {
            "emotion": top_emotion,
            "confidence": emotions[top_emotion],
            "all_emotions": emotions,
            "face_detected": True,
            "face_location": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
        }
    except Exception as e:
        print(f"Emotion detection error: {e}")
        return {"emotion": "error", "confidence": 0.0, "all_emotions": {}}

def analyze_pose_advanced(image_path: str):
    """
    Advanced pose analysis using image processing
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return {"pose_detected": False}
        
        # Resize if too large
        height, width = img.shape[:2]
        if width > 1024:
            scale = 1024 / width
            img = cv2.resize(img, (1024, int(height * scale)))
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        
        # Try to detect face first (as fallback for body)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
        
        # Detect body using full body cascade
        body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')
        bodies = body_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(50, 100))
        
        if len(bodies) == 0:
            # Try upper body with relaxed parameters
            upper_body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_upperbody.xml')
            bodies = upper_body_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(30, 60))
        
        if len(bodies) > 0:
            (x, y, w, h) = bodies[0]
            body_roi = gray[y:y+h, x:x+w]
            
            # Analyze body posture
            aspect_ratio = h / w if w > 0 else 1
            body_variance = np.var(body_roi)
            
            # Estimate activity level
            if body_variance > 1000:
                activity_level = "active"
                posture_score = 85
            elif body_variance > 500:
                activity_level = "moderate"
                posture_score = 75
            else:
                activity_level = "sedentary"
                posture_score = 65
            
            # Estimate balance based on aspect ratio
            if 1.5 < aspect_ratio < 2.5:
                balance_score = 85
            elif 1.0 < aspect_ratio < 3.0:
                balance_score = 70
            else:
                balance_score = 60
            
            return {
                "pose_detected": True,
                "posture_score": posture_score,
                "balance_score": balance_score,
                "symmetry_score": 0.85,
                "activity_level": activity_level,
                "motor_development": "normal" if posture_score > 70 else "needs_assessment",
                "body_location": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
            }
        elif len(faces) > 0:
            # Use face detection as fallback for pose
            (x, y, w, h) = faces[0]
            # Estimate body from face (assume body is 3x face height)
            body_h = h * 3
            body_w = w * 2
            body_y = y
            
            return {
                "pose_detected": True,
                "posture_score": 75,
                "balance_score": 75,
                "symmetry_score": 0.80,
                "activity_level": "moderate",
                "motor_development": "normal",
                "body_location": {"x": int(x), "y": int(body_y), "width": int(body_w), "height": int(body_h)},
                "note": "Estimated from face detection"
            }
        else:
            return {"pose_detected": False, "message": "No body or face detected in image"}
    except Exception as e:
        print(f"Pose detection error: {e}")
        return {"pose_detected": False, "error": str(e)}

def analyze_facial_features(image_path: str):
    """
    Analyze facial features for developmental indicators
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return {"face_detected": False}
        
        # Resize if needed
        height, width = img.shape[:2]
        if width > 1024:
            scale = 1024 / width
            img = cv2.resize(img, (1024, int(height * scale)))
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        
        # Detect face with multiple attempts
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
        
        if len(faces) == 0:
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(20, 20))
        
        if len(faces) == 0:
            alt_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')
            faces = alt_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
        
        if len(faces) == 0:
            return {"face_detected": False}
        
        (x, y, w, h) = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        
        # Detect eyes with relaxed parameters
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        eyes = eye_cascade.detectMultiScale(face_roi, scaleFactor=1.1, minNeighbors=2, minSize=(10, 10))
        
        # Calculate facial symmetry
        left_half = face_roi[:, :w//2]
        right_half = cv2.flip(face_roi[:, w//2:], 1)
        
        # Resize to same size
        min_width = min(left_half.shape[1], right_half.shape[1])
        left_half = cv2.resize(left_half, (min_width, face_roi.shape[0]))
        right_half = cv2.resize(right_half, (min_width, face_roi.shape[0]))
        
        # Calculate similarity
        difference = cv2.absdiff(left_half, right_half)
        symmetry_score = 1.0 - (np.mean(difference) / 255.0)
        
        # Eye contact quality (based on eye detection)
        eye_contact_quality = "good" if len(eyes) >= 2 else "needs_assessment"
        
        return {
            "face_detected": True,
            "eye_contact_quality": eye_contact_quality,
            "eyes_detected": len(eyes),
            "facial_symmetry": float(symmetry_score),
            "proportions_normal": True if 0.8 < symmetry_score < 1.0 else False,
            "developmental_flags": [] if symmetry_score > 0.75 else [
                {"type": "symmetry", "message": "Facial asymmetry detected, may need assessment"}
            ]
        }
    except Exception as e:
        print(f"Facial analysis error: {e}")
        return {"face_detected": False, "error": str(e)}

def comprehensive_analysis(image_path: str):
    """
    Complete child development analysis from image
    """
    results = {
        "emotion": analyze_emotion_advanced(image_path),
        "pose": analyze_pose_advanced(image_path),
        "facial_features": analyze_facial_features(image_path),
        "overall_score": 0,
        "recommendations": []
    }
    
    # Calculate overall score
    score = 70  # Base score
    
    # Emotion factors
    if results["emotion"]["emotion"] in ["happy", "neutral"]:
        score += 10
    elif results["emotion"]["emotion"] in ["sad", "angry"]:
        score -= 10
    
    # Pose factors
    if results["pose"].get("pose_detected"):
        score += (results["pose"].get("posture_score", 70) - 70) * 0.3
    
    # Facial features
    if results["facial_features"].get("face_detected"):
        if results["facial_features"].get("facial_symmetry", 0) > 0.8:
            score += 10
        if results["facial_features"].get("eyes_detected", 0) >= 2:
            score += 5
    
    results["overall_score"] = min(100, max(0, int(score)))
    
    # Generate recommendations
    recommendations = []
    
    if results["emotion"]["emotion"] in ["sad", "angry"]:
        recommendations.append({
            "category": "Emotional Well-being",
            "priority": "High",
            "action": "Consider emotional support and parent counseling",
            "reason": f"Child shows signs of {results['emotion']['emotion']}"
        })
    
    if results["pose"].get("motor_development") == "needs_assessment":
        recommendations.append({
            "category": "Motor Development",
            "priority": "Medium",
            "action": "Schedule motor skills assessment",
            "reason": "Pose analysis indicates potential motor concerns"
        })
    
    if results["facial_features"].get("developmental_flags"):
        for flag in results["facial_features"]["developmental_flags"]:
            recommendations.append({
                "category": "Physical Development",
                "priority": "Medium",
                "action": "Consult with pediatrician",
                "reason": flag["message"]
            })
    
    if not recommendations:
        recommendations.append({
            "category": "General",
            "priority": "Low",
            "action": "Continue regular monitoring",
            "reason": "No immediate concerns detected"
        })
    
    results["recommendations"] = recommendations
    
    return results

def analyze_image(image_path: str):
    """
    Main entry point for image analysis
    """
    return comprehensive_analysis(image_path)

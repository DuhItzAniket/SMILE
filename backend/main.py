from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, prediction, dashboard, intervention, assessment
from app.utils.database import init_db

app = FastAPI(
    title="SMILE API",
    description="Smart Monitoring & Intelligent Learning Environment for ECD",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(intervention.router, prefix="/api", tags=["Intervention"])
app.include_router(assessment.router, prefix="/api", tags=["Assessment"])

@app.get("/")
def root():
    return {
        "message": "SMILE API v2.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

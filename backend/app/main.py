from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 1. Import the router
from app.api import recruiter 

app = FastAPI(title="PlacementPro API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Register the router with the correct prefix
# This turns the "/match" route into "/api/recruiter/match"
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["Recruiter"])

@app.get("/")
async def root():
    return {"message": "PlacementPro Backend is Live"}
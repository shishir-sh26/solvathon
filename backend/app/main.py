from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import recruiter 

app = FastAPI(title="PlacementPro API")

# Essential CORS for React + FastAPI communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTER ROUTER
# This MUST match the path in your frontend fetch request
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["Recruiter"])

@app.on_event("startup")
async def startup_event():
    print("--- API ROUTES LOADED ---")
    for route in app.routes:
        print(f"Path: {route.path}")

@app.get("/")
async def root():
    return {"message": "PlacementPro Backend is Live"}
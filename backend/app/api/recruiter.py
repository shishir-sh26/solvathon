from fastapi import APIRouter, Query
from app.services.matching_engine import run_matching_logic

router = APIRouter()

@router.get("/match")
async def get_candidate_matches(job_description: str = Query(...)):
    results = run_matching_logic(job_description)
    return {"matches": results}
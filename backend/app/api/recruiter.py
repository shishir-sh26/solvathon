from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from app.services.matching_engine import run_matching_logic, DUMMY_STUDENTS # <-- Make sure to import DUMMY_STUDENTS
from app.services.exports.historical_report_generator import generate_historical_report_pdf

router = APIRouter()
# Dummy Historical Data for PDF
MOCK_HISTORICAL_DATA = [
    { 'year': '2023', 'hired': 15, 'avgCtc': '12 LPA', 'topBranch': 'CS' },
    { 'year': '2024', 'hired': 22, 'avgCtc': '14 LPA', 'topBranch': 'IS' },
    { 'year': '2025', 'hired': 18, 'avgCtc': '15 LPA', 'topBranch': 'CS' },
]

@router.get("/match")
async def get_candidate_matches(job_description: str = Query(...)):
    """Handles the Match AI button"""
    results = run_matching_logic(job_description)
    return {"matches": results}

@router.get("/tpo/students")
async def get_tpo_students(search: str = None):
    """
    Endpoint for TPO Dashboard.
    If search is provided, uses matching logic. Otherwise returns all students.
    """
    if search:
        # Re-use the matching engine!
        results = run_matching_logic(search)
        return {"students": results}
    
    # If no search, return everyone
    return {"students": DUMMY_STUDENTS}

@router.get("/reports/download")
async def download_historical_report():
    """Handles the PDF Report button"""
    pdf_buffer = generate_historical_report_pdf(MOCK_HISTORICAL_DATA, "TechNova Global")
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Hiring_Report.pdf"}
    )
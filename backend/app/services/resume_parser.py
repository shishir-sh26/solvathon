import fitz  # PyMuPDF
import json
from app.services.llm_service import llm_service

async def parse_resume(file_path: str):
    # 1. Extract text from PDF
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    # 2. Use Gemini to extract skills and score ATS
    prompt = f"""
    Analyze the following resume text and extract:
    1. A list of technical skills.
    2. A list of soft skills.
    3. An ATS score (0-100) based on clarity, formatting, and industry-standard keywords.
    4. A brief summary of the profile.
    
    Resume Text:
    {text}
    
    Return the result as a JSON object with keys: 'tech_skills', 'soft_skills', 'ats_score', 'summary'.
    """
    
    response_text = await llm_service.get_structured_json(prompt)
    try:
        # Clean the response if it contains markdown markers
        cleaned_json = response_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned_json)
        return data
    except Exception as e:
        return {"error": f"Failed to parse AI response: {str(e)}", "raw": response_text}

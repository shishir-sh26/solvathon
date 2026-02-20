from typing import List
import numpy as np
from app.services.llm_service import llm_service

async def calculate_match(student_skills: List[str], job_description: str):
    """
    Calculates the match percentage between student skills and a job description using Gemini.
    """
    skills_str = ", ".join(student_skills)
    prompt = f"""
    Job Description: {job_description}
    Student Skills: {skills_str}
    
    Calculate a match percentage (0-100) and provide a 1-sentence justification.
    Return only JSON: {{"percentage": 85, "justification": "..."}}
    """
    
    response_text = await llm_service.get_structured_json(prompt)
    try:
        cleaned_json = response_text.replace("```json", "").replace("```", "").strip()
        import json
        return json.loads(cleaned_json)
    except:
        return {"percentage": 0, "justification": "Error in matching logic"}

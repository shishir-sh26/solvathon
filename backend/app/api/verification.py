from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pymupdf # Using PyMuPDF for lightning-fast text extraction
import google.generativeai as genai
import os
import io
import json

router = APIRouter()

# Configure Gemini (Ensure GEMINI_API_KEY is in your .env)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

@router.post("/verify-credential")
async def verify_credential(
    skill_claimed: str = Form(...), 
    file: UploadFile = File(...) # FastAPI handles the multipart form data
):
    # 1. Validate it's a PDF
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF certificates are supported for MVP.")

    try:
        # 2. Read the file into memory and extract text using PyMuPDF
        pdf_bytes = await file.read()
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        
        extracted_text = ""
        for page in doc:
            extracted_text += page.get_text("text") # Extracts plain text from the PDF
            
        doc.close()

        # 3. Prompt Gemini to act as a strict verification agent
        prompt = f"""
        You are an expert credential verifier. 
        A student claims this certificate proves they possess the skill: "{skill_claimed}".
        
        Here is the raw text extracted from their uploaded certificate:
        ---
        {extracted_text}
        ---
        
        Analyze the text. Does it look like a legitimate certificate for this skill?
        Respond STRICTLY with a JSON object in this format, and nothing else:
        {{
            "is_verified": true/false,
            "confidence_score": 0-100,
            "reason": "Short explanation of why it passed or failed"
        }}
        """
        
        # 4. Get the AI Verdict
        response = model.generate_content(prompt)
        
        # Parse the JSON string returned by Gemini into a Python dictionary
        verdict = json.loads(response.text.strip('```json').strip('```'))
        
        # NOTE: In a real app, you would now update the student's profile in Supabase 
        # to mark 'skill_claimed' as verified based on verdict["is_verified"].
        
        return {"success": True, "data": verdict}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
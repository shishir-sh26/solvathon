from app.services.llm_service import llm_service
import json

async def analyze_sentiment(interview_text: str):
    prompt = f"""
    Analyze the following mock interview transcript:
    "{interview_text}"
    
    Provide:
    1. Sentiment (Positive/Neutral/Negative).
    2. Confidence level (0.0 to 1.0).
    3. Constructive feedback for the student.
    
    Return as JSON: {{"sentiment": "...", "confidence": 0.9, "feedback": "..."}}
    """
    
    response_text = await llm_service.get_structured_json(prompt)
    try:
        cleaned_json = response_text.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_json)
    except:
        return {"sentiment": "Neutral", "confidence": 0.5, "feedback": "Could not analyze text."}

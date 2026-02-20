import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

class LLMService:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model = genai.GenerativeModel(model_name)

    async def generate_text(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text

    async def get_structured_json(self, prompt: str) -> str:
        # Simple wrapper for now, can be extended for structured output
        response = self.model.generate_content(prompt + "\nReturn ONLY valid JSON.")
        return response.text

llm_service = LLMService()

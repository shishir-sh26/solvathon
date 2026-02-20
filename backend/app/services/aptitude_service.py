from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
import os
import json
from dotenv import load_dotenv

load_dotenv()

class AptitudeService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.7
        )

    async def generate_test(self, domain: str, difficulty: str) -> list:
        system_msg = """
        You are a professional assessment engine. 
        Generate 10 multiple-choice questions for an aptitude test.
        """
        
        prompt = f"""
        Domain: {domain}
        Difficulty: {difficulty} (Easy: Basic concepts, Medium: Applied knowledge, Hard: Advanced/Technical).
        
        The output must be a JSON array of objects. Each object must have:
        - "id": unique number 1-10
        - "question": string
        - "options": {{ "A": string, "B": string, "C": string, "D": string }}
        - "correct_answer": "A", "B", "C", or "D"
        
        Return ONLY a raw JSON array. Do not include markdown formatting.
        """
        
        response = await self.llm.ainvoke([
            SystemMessage(content=system_msg),
            HumanMessage(content=prompt)
        ])
        content = response.content
        
        try:
            # Handle potential markdown wrappers from Gemini
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
        except Exception as e:
            print(f"ERROR parsing Aptitude JSON: {str(e)}")
            return []

    def calculate_score(self, questions: list, answers: dict) -> dict:
        score = 0
        details = []
        for q in questions:
            q_id = str(q['id'])
            student_ans = answers.get(q_id)
            is_correct = student_ans == q['correct_answer']
            if is_correct:
                score += 1
            details.append({
                "question_id": q_id,
                "correct": is_correct,
                "correct_answer": q['correct_answer'],
                "student_answer": student_ans
            })
        
        percentage = (score / len(questions)) * 100 if questions else 0
        return {
            "score": score,
            "total": len(questions),
            "percentage": percentage,
            "details": details
        }

aptitude_service = AptitudeService()

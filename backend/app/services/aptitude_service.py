from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
import os
import json
from dotenv import load_dotenv

load_dotenv()

FALLBACK_APTITUDE_QUESTIONS = {
    "Software Engineering": [
        {"id": 1, "question": "What is the time complexity of binary search?", "options": {"A": "O(n)", "B": "O(log n)", "C": "O(n²)", "D": "O(1)"}, "correct_answer": "B"},
        {"id": 2, "question": "Which data structure uses LIFO (Last In First Out) order?", "options": {"A": "Queue", "B": "Array", "C": "Stack", "D": "Linked List"}, "correct_answer": "C"},
        {"id": 3, "question": "What does HTTP stand for?", "options": {"A": "HyperText Transfer Protocol", "B": "High Tech Transfer Protocol", "C": "HyperText Transmission Protocol", "D": "Hyperlink Transfer Protocol"}, "correct_answer": "A"},
        {"id": 4, "question": "Which sorting algorithm has the best average case time complexity?", "options": {"A": "Bubble Sort", "B": "Selection Sort", "C": "Merge Sort", "D": "Insertion Sort"}, "correct_answer": "C"},
        {"id": 5, "question": "What is the purpose of a primary key in a relational database?", "options": {"A": "To encrypt data", "B": "To uniquely identify each record", "C": "To link two tables", "D": "To speed up queries"}, "correct_answer": "B"},
        {"id": 6, "question": "In OOP, what is encapsulation?", "options": {"A": "Inheriting properties from a parent class", "B": "Hiding internal implementation details", "C": "Overriding a method", "D": "Using multiple classes"}, "correct_answer": "B"},
        {"id": 7, "question": "What is a REST API?", "options": {"A": "A type of database", "B": "A programming language", "C": "An architectural style for networked applications", "D": "A frontend framework"}, "correct_answer": "C"},
        {"id": 8, "question": "Which keyword is used to handle exceptions in Python?", "options": {"A": "catch", "B": "error", "C": "exception", "D": "try"}, "correct_answer": "D"},
        {"id": 9, "question": "What does DNS stand for?", "options": {"A": "Domain Name System", "B": "Data Network Service", "C": "Dynamic Name Server", "D": "Direct Network System"}, "correct_answer": "A"},
        {"id": 10, "question": "Which of these is NOT a JavaScript framework?", "options": {"A": "React", "B": "Angular", "C": "Django", "D": "Vue"}, "correct_answer": "C"},
    ],
    "Data Science": [
        {"id": 1, "question": "What does ML stand for?", "options": {"A": "Main Logic", "B": "Machine Learning", "C": "Model Layer", "D": "Meta Language"}, "correct_answer": "B"},
        {"id": 2, "question": "Which algorithm is used for classification problems?", "options": {"A": "Linear Regression", "B": "K-Means Clustering", "C": "Decision Tree", "D": "PCA"}, "correct_answer": "C"},
        {"id": 3, "question": "What is the purpose of normalization in data preprocessing?", "options": {"A": "Reduce training time", "B": "Scale features to a similar range", "C": "Remove outliers", "D": "Increase model accuracy"}, "correct_answer": "B"},
        {"id": 4, "question": "Which Python library is primarily used for data manipulation?", "options": {"A": "NumPy", "B": "Matplotlib", "C": "Pandas", "D": "Scikit-learn"}, "correct_answer": "C"},
        {"id": 5, "question": "What is overfitting?", "options": {"A": "Model performs well on training but poorly on test data", "B": "Model is too simple", "C": "Model has low accuracy", "D": "Model takes too long to train"}, "correct_answer": "A"},
        {"id": 6, "question": "What is the purpose of a confusion matrix?", "options": {"A": "Train the model", "B": "Evaluate classification performance", "C": "Reduce dimensions", "D": "Split dataset"}, "correct_answer": "B"},
        {"id": 7, "question": "What does PCA stand for?", "options": {"A": "Primary Component Analysis", "B": "Principal Component Analysis", "C": "Pattern Classification Algorithm", "D": "Predictive Clustering Algorithm"}, "correct_answer": "B"},
        {"id": 8, "question": "Which metric measures the percentage of correct predictions?", "options": {"A": "Precision", "B": "Recall", "C": "Accuracy", "D": "F1-Score"}, "correct_answer": "C"},
        {"id": 9, "question": "What is a neural network inspired by?", "options": {"A": "Computer circuits", "B": "Biological brains", "C": "Statistical models", "D": "Graph theory"}, "correct_answer": "B"},
        {"id": 10, "question": "Which type of learning does not use labeled data?", "options": {"A": "Supervised Learning", "B": "Reinforcement Learning", "C": "Unsupervised Learning", "D": "Transfer Learning"}, "correct_answer": "C"},
    ],
    "default": [
        {"id": 1, "question": "Which of the following is an example of a soft skill?", "options": {"A": "Python programming", "B": "Data analysis", "C": "Communication", "D": "SQL queries"}, "correct_answer": "C"},
        {"id": 2, "question": "What does KPI stand for?", "options": {"A": "Key Performance Indicator", "B": "Key Process Integration", "C": "Knowledge Planning Index", "D": "Key Project Identification"}, "correct_answer": "A"},
        {"id": 3, "question": "What is the primary goal of project management?", "options": {"A": "Reduce team size", "B": "Deliver projects on time and within budget", "C": "Increase salary", "D": "Minimize meetings"}, "correct_answer": "B"},
        {"id": 4, "question": "What does ROI stand for?", "options": {"A": "Return on Investment", "B": "Rate of Income", "C": "Revenue of Industry", "D": "Return of Interest"}, "correct_answer": "A"},
        {"id": 5, "question": "Which of these is a version control system?", "options": {"A": "Jira", "B": "Slack", "C": "Git", "D": "Zoom"}, "correct_answer": "C"},
        {"id": 6, "question": "What is Agile methodology?", "options": {"A": "A programming language", "B": "An iterative project management approach", "C": "A database system", "D": "A testing framework"}, "correct_answer": "B"},
        {"id": 7, "question": "What does UI stand for in software development?", "options": {"A": "Unified Interaction", "B": "User Interface", "C": "Universal Integration", "D": "Unique Identifier"}, "correct_answer": "B"},
        {"id": 8, "question": "What is the cloud in computing?", "options": {"A": "Weather-related technology", "B": "Remote servers for storing and processing data", "C": "A type of RAM", "D": "An operating system"}, "correct_answer": "B"},
        {"id": 9, "question": "What does CEO stand for?", "options": {"A": "Chief Engineering Officer", "B": "Central Executive Office", "C": "Chief Executive Officer", "D": "Company Executive Operations"}, "correct_answer": "C"},
        {"id": 10, "question": "What is a spreadsheet used for?", "options": {"A": "Video editing", "B": "Organizing and analyzing data in rows and columns", "C": "Writing code", "D": "Designing graphics"}, "correct_answer": "B"},
    ]
}


class AptitudeService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.7
            )
            self.ai_available = True
        except Exception as e:
            print(f"WARNING: Could not initialize Gemini LLM: {e}. Using fallback mode.")
            self.llm = None
            self.ai_available = False

    async def generate_test(self, domain: str, difficulty: str) -> list:
        if not self.ai_available:
            return self._get_fallback_questions(domain)

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

        try:
            response = await self.llm.ainvoke([
                SystemMessage(content=system_msg),
                HumanMessage(content=prompt)
            ])
            content = response.content

            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
        except Exception as e:
            print(f"Gemini API Error: {e}. Using fallback questions.")
            return self._get_fallback_questions(domain)

    def _get_fallback_questions(self, domain: str) -> list:
        return FALLBACK_APTITUDE_QUESTIONS.get(domain, FALLBACK_APTITUDE_QUESTIONS["default"])

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

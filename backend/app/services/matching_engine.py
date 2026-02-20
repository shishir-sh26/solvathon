import re

# DUMMY DATASET
DUMMY_STUDENTS = [
    { "id": 101, "name": "Arjun Mehta", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["React", "Node", "TypeScript", "Tailwind"] },
    { "id": 102, "name": "Sneha Rao", "branch": "IS", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Python", "Django", "SQL", "Machine Learning"] },
    { "id": 103, "name": "Vikram Singh", "branch": "EC", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["C++", "Embedded Systems", "IoT", "Arduino"] },
    { "id": 104, "name": "Ananya Iyer", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Java", "Spring Boot", "AWS", "Docker"] },
    { "id": 105, "name": "Zaid Khan", "branch": "CSD", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["UI/UX", "Figma", "React", "Frontend"] },
]

def run_matching_logic(job_description: str):
    # Extract words from the description
    desc_words = set(re.findall(r'\w+', job_description.lower()))
    matched_results = []

    for student in DUMMY_STUDENTS:
        student_skills = [s.lower() for s in student["skills"]]
        # Count overlaps
        matches = [skill for skill in student_skills if skill in desc_words]
        
        # Calculate Score
        score = int((len(matches) / len(student_skills)) * 100) if student_skills else 0
        
        updated_student = student.copy()
        updated_student["matchScore"] = score
        matched_results.append(updated_student)

    # Sort: Highest match first
    matched_results.sort(key=lambda x: x["matchScore"], reverse=True)
    return matched_results
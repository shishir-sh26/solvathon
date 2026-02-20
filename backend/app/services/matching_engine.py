import re

# DUMMY DATASET - Now with 20 Students
DUMMY_STUDENTS = [
    { "id": 101, "name": "Arjun Mehta", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["React", "Node", "TypeScript", "Tailwind"] },
    { "id": 102, "name": "Sneha Rao", "branch": "IS", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Python", "Django", "SQL", "Machine Learning"] },
    { "id": 103, "name": "Vikram Singh", "branch": "EC", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["C++", "Embedded Systems", "IoT", "Arduino"] },
    { "id": 104, "name": "Ananya Iyer", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Java", "Spring Boot", "AWS", "Docker"] },
    { "id": 105, "name": "Zaid Khan", "branch": "CSD", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["UI/UX", "Figma", "React", "Frontend"] },
    # --- 15 NEW DATASETS ADDED BELOW ---
    { "id": 106, "name": "Rohan Das", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Golang", "Kubernetes", "Docker", "PostgreSQL"] },
    { "id": 107, "name": "Priya Kapoor", "branch": "IS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["PHP", "Laravel", "MySQL", "Vue.js"] },
    { "id": 108, "name": "Kabir Sharma", "branch": "MCA", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Android", "Kotlin", "Firebase", "Java"] },
    { "id": 109, "name": "Ishani Verma", "branch": "CSD", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Adobe XD", "Illustrator", "React Native", "CSS"] },
    { "id": 110, "name": "Siddharth Malhotra", "branch": "EC", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Python", "OpenCV", "Raspberry Pi", "MATLAB"] },
    { "id": 111, "name": "Meera Joshi", "branch": "IS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Swift", "iOS", "Xcode", "Objective-C"] },
    { "id": 112, "name": "Aditya Reddy", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Rust", "WebAssembly", "C++", "Blockchain"] },
    { "id": 113, "name": "Tanya Sen", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Angular", "RxJS", "TypeScript", "SASS"] },
    { "id": 114, "name": "Rahul Bose", "branch": "MCA", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["SQL Server", "ASP.NET", "C#", "Azure"] },
    { "id": 115, "name": "Sanya Mirza", "branch": "IS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Data Science", "Pandas", "R", "Tableau"] },
    { "id": 116, "name": "Varun Grover", "branch": "EC", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Verilog", "VLSI", "FPGA", "Digital Electronics"] },
    { "id": 117, "name": "Nisha Bansal", "branch": "CSD", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Three.js", "WebGl", "Blender", "JavaScript"] },
    { "id": 118, "name": "Deepak Chawla", "branch": "CS", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["Next.js", "GraphQL", "Prisma", "Node"] },
    { "id": 119, "name": "Aman Gupta", "branch": "IS", "matchScore": 0, "status": "Applied", "docsVerified": False, "skills": ["Cyber Security", "Ethical Hacking", "Wireshark", "Linux"] },
    { "id": 120, "name": "Riya Singh", "branch": "MCA", "matchScore": 0, "status": "Applied", "docsVerified": True, "skills": ["QA Testing", "Selenium", "Jest", "Automation"] }
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
        # (Matches / Student Skill Set Size) * 100
        score = int((len(matches) / len(student_skills)) * 100) if student_skills else 0
        
        updated_student = student.copy()
        updated_student["matchScore"] = score
        matched_results.append(updated_student)

    # Sort: Highest match first
    matched_results.sort(key=lambda x: x["matchScore"], reverse=True)
    return matched_results
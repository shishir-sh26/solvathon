from fpdf import FPDF
import io

class ResumePDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 20)
        self.cell(0, 10, self.student_name, ln=True, align='C')
        self.set_font('helvetica', '', 10)
        self.cell(0, 5, f"{self.email} | {self.phone} | {self.location}", ln=True, align='C')
        self.ln(5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def section_title(self, title):
        self.set_font('helvetica', 'B', 14)
        self.set_fill_color(240, 240, 240)
        self.cell(0, 8, title, ln=True, fill=True)
        self.ln(2)

    def body_text(self, text):
        self.set_font('helvetica', '', 11)
        self.multi_cell(0, 6, text)
        self.ln(3)

def generate_ats_resume(data: dict) -> io.BytesIO:
    pdf = ResumePDF()
    pdf.student_name = data.get('full_name', 'Student Name').upper()
    pdf.email = data.get('email', '')
    pdf.phone = data.get('phone', '')
    pdf.location = data.get('branch', '')
    
    pdf.add_page()
    
    # Education Section
    pdf.section_title("EDUCATION")
    edu_text = f"USN: {data.get('roll_number', 'N/A')}\n"
    edu_text += f"B.E in {data.get('branch', 'Engineering')} | Graduation: {data.get('graduation_year', '2025')}\n"
    edu_text += f"Current CGPA: {data.get('cgpa', 'N/A')} | Backlogs: {data.get('backlogs', 0)}"
    pdf.body_text(edu_text)
    
    # Secondary Education
    edu_secondary = f"SSLC Score: {data.get('sslc_percentage', 'N/A')}%\n"
    edu_secondary += f"PUC / Diploma Score: {data.get('puc_percentage', 'N/A')}%"
    pdf.body_text(edu_secondary)
    
    # Skills Section
    pdf.section_title("TECHNICAL SKILLS")
    skills = data.get('skills', [])
    if isinstance(skills, str):
        skills_text = skills
    else:
        skills_text = ", ".join(skills)
    pdf.body_text(skills_text)
    
    # Certifications
    if data.get('certifications'):
        pdf.section_title("CERTIFICATIONS")
        pdf.body_text(data.get('certifications'))
    
    # Buffer
    buffer = io.BytesIO()
    pdf.output(buffer)
    buffer.seek(0)
    return buffer

from fpdf import FPDF
import io
from datetime import datetime

class HistoricalReportPDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 16)
        self.cell(0, 10, 'PLACEMENTPRO ANALYTICS: HIRING TRENDS', ln=True, align='C')
        self.set_font('helvetica', 'I', 10)
        self.cell(0, 5, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', ln=True, align='C')
        self.ln(10)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def generate_historical_report_pdf(historical_data: list, company_name: str) -> io.BytesIO:
    pdf = HistoricalReportPDF()
    pdf.add_page()
    
    # Company Header Section
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_fill_color(0, 0, 0)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 10, f' RECRUITER PERFORMANCE: {company_name.upper()}', ln=True, fill=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)

    # Table Header
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_fill_color(230, 230, 230)
    pdf.cell(30, 10, 'Year', border=1, fill=True)
    pdf.cell(50, 10, 'Students Hired', border=1, fill=True)
    pdf.cell(50, 10, 'Average CTC', border=1, fill=True)
    pdf.cell(60, 10, 'Top Branch', border=1, fill=True, ln=True)

    # Table Body
    pdf.set_font('helvetica', '', 11)
    for row in historical_data:
        pdf.cell(30, 10, str(row['year']), border=1)
        pdf.cell(50, 10, str(row['hired']), border=1)
        pdf.cell(50, 10, row['avgCtc'], border=1)
        pdf.cell(60, 10, row['topBranch'], border=1, ln=True)

    pdf.ln(10)
    
    # Analysis Summary
    pdf.set_font('helvetica', 'B', 12)
    pdf.cell(0, 10, 'Executive Summary:', ln=True)
    pdf.set_font('helvetica', '', 11)
    total_hired = sum(row['hired'] for row in historical_data)
    summary_text = (
        f"Based on the historical data, {company_name} has recruited a total of {total_hired} "
        f"students over the last three cycles. The growth trend indicates a steady increase "
        f"in Average CTC, reflecting a demand for high-tier technical talent."
    )
    pdf.multi_cell(0, 7, summary_text)

    # Return Buffer
    buffer = io.BytesIO()
    pdf_output = pdf.output()
    buffer.write(pdf_output)
    buffer.seek(0)
    return buffer
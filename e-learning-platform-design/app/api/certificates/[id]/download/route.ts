import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: certificateId } = await params

    // Get certificate with user and course data
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: true,
        course: true,
      },
    })

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Generate HTML content for the certificate with premium design
    const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Achievement</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&family=Montserrat:wght@300&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          
          .container {
            width: 100%;
            max-width: 1200px;
          }
          
          .certificate {
            width: 100%;
            aspect-ratio: 16 / 9;
            background: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            display: flex;
            border-radius: 10px;
          }
          
          /* Left Accent */
          .certificate::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 8px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          }
          
          /* Top Accent */
          .certificate::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          }
          
          .certificate-content {
            flex: 1;
            padding: 60px 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 2;
          }
          
          .header {
            margin-bottom: 20px;
          }
          
          .logo-area {
            font-size: 24px;
            margin-bottom: 15px;
          }
          
          .platform-name {
            font-size: 12px;
            font-family: 'Montserrat', sans-serif;
            letter-spacing: 2px;
            color: #667eea;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          h1 {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            color: #1a1a1a;
            margin-bottom: 15px;
            font-weight: 700;
          }
          
          .subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 25px;
            font-weight: 300;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-family: 'Montserrat', sans-serif;
          }
          
          .divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            margin: 0 auto 30px;
          }
          
          .recipient-section {
            margin: 40px 0;
          }
          
          .recipient-label {
            font-size: 13px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-family: 'Montserrat', sans-serif;
          }
          
          .recipient-name {
            font-family: 'Playfair Display', serif;
            font-size: 40px;
            color: #1a1a1a;
            margin-bottom: 25px;
            font-weight: 700;
          }
          
          .achievement-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            font-weight: 300;
            letter-spacing: 1px;
          }
          
          .course-title {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            color: #667eea;
            margin: 15px 0;
            font-weight: 700;
          }
          
          .completion-info {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #eee;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          
          .info-block {
            text-align: center;
          }
          
          .info-label {
            font-size: 11px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
            font-family: 'Montserrat', sans-serif;
          }
          
          .info-value {
            font-size: 13px;
            color: #1a1a1a;
            font-weight: 500;
          }
          
          .seal {
            position: absolute;
            top: 40px;
            right: 60px;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            z-index: 3;
          }
          
          .seal-ring {
            position: absolute;
            width: 110px;
            height: 110px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 50%;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .certificate {
              width: 11in;
              height: 8.5in;
              margin: 0;
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="certificate">
            <div class="seal-ring"></div>
            <div class="seal">🏆</div>
            
            <div class="certificate-content">
              <div class="header">
                <div class="platform-name">EduLearn Academy</div>
                <h1>Certificate of Achievement</h1>
                <p class="subtitle">of successful course completion</p>
              </div>
              
              <div class="divider"></div>
              
              <div class="recipient-section">
                <p class="recipient-label">This certificate is proudly awarded to</p>
                <div class="recipient-name">${certificate.user.name}</div>
                
                <p class="achievement-text">for successfully completing</p>
                <div class="course-title">${certificate.course.title}</div>
                
                <p class="achievement-text">and demonstrating mastery of all course material and requirements.</p>
              </div>
              
              <div class="completion-info">
                <div class="info-block">
                  <p class="info-label">Date of Issue</p>
                  <p class="info-value">${formattedDate}</p>
                </div>
                <div class="info-block">
                  <p class="info-label">Certificate ID</p>
                  <p class="info-value">${certificate.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Return HTML that can be printed or converted to PDF
    // Client will use html2pdf or similar to convert to PDF
    return NextResponse.json({
      html: htmlContent,
      fileName: `${certificate.user.name.replace(/\s+/g, '-')}-${certificate.course.title.replace(/\s+/g, '-')}-certificate.pdf`,
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


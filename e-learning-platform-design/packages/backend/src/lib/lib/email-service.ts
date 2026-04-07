import nodemailer from "nodemailer"

// Create transporter - configurasi Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular Gmail password
  },
})

/**
 * Send verification code email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationCode: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify Your EduLearn Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to EduLearn!</h1>
          </div>
          
          <div style="padding: 40px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hi ${name},</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              Thank you for creating an account with EduLearn. To verify your email address and complete your registration, please use the verification code below:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 2px solid #667eea;">
              <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
              <p style="margin: 10px 0 0 0; font-size: 36px; font-weight: bold; color: #667eea; font-family: 'Courier New', monospace; letter-spacing: 4px;">
                ${verificationCode}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              This code will expire in <strong>10 minutes</strong>. If you didn't create an account, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999;">
              If you have any questions, please contact our support team at support@edulearn.com
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; color: white; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
            <p style="margin: 0;">© 2025 EduLearn. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("[EMAIL] Verification email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("[EMAIL] Failed to send verification email:", error)
    return false
  }
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome to EduLearn! Complete Your Profile",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Email Verified!</h1>
          </div>
          
          <div style="padding: 40px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hi ${name},</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              Your email has been verified successfully! Now let's complete your profile to get started with learning amazing courses.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
              <ol style="color: #666; line-height: 1.8;">
                <li>Complete your profile information</li>
                <li>Upload a profile picture</li>
                <li>Select your learning interests</li>
                <li>Start exploring courses</li>
              </ol>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/complete-profile" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Complete Your Profile
            </a>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999;">
              If you have any questions, please contact our support team at support@edulearn.com
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; color: white; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
            <p style="margin: 0;">© 2025 EduLearn. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("[EMAIL] Welcome email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("[EMAIL] Failed to send welcome email:", error)
    return false
  }
}







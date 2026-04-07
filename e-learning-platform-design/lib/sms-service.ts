import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

// Initialize Twilio client
const client = twilio(accountSid, authToken)

/**
 * Send SMS verification code
 */
export async function sendVerificationSMS(
  phoneNumber: string,
  verificationCode: string
): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.warn("[SMS] Twilio credentials not configured")
      console.log(`[SMS] TEST MODE - Code for ${phoneNumber}: ${verificationCode}`)
      return true // In test mode, just log
    }

    const message = await client.messages.create({
      body: `Your EduLearn verification code is: ${verificationCode}\n\nThis code expires in 10 minutes.`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })

    console.log(`[SMS] Verification SMS sent to ${phoneNumber}, MessageSID: ${message.sid}`)
    return true
  } catch (error) {
    console.error(`[SMS] Failed to send SMS to ${phoneNumber}:`, error)
    return false
  }
}

/**
 * Send welcome SMS after verification
 */
export async function sendWelcomeSMS(
  phoneNumber: string,
  name: string
): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.log(`[SMS] TEST MODE - Welcome message for ${phoneNumber}`)
      return true // In test mode, just log
    }

    const message = await client.messages.create({
      body: `Welcome to EduLearn, ${name}! 🎓\n\nYour email has been verified. Now complete your profile to start learning amazing courses.\n\nLet's get started!`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })

    console.log(`[SMS] Welcome SMS sent to ${phoneNumber}, MessageSID: ${message.sid}`)
    return true
  } catch (error) {
    console.error(`[SMS] Failed to send welcome SMS:`, error)
    return false
  }
}










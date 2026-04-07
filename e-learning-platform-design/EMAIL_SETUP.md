# Email Verification Setup Guide

## Production Email Configuration

Sistem verification code dikirim via email menggunakan SMTP yang reliable dan professional.

---

## **Setup Options**

### **Option 1: Gmail SMTP (Recommended untuk development/testing)**

**Setup:**
1. Buka https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Buka https://myaccount.google.com/apppasswords
4. Generate App Password (16 karakter)
5. Add ke `.env`:

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

---

### **Option 2: SendGrid (Recommended untuk production)**

**Setup:**
1. Register di https://sendgrid.com
2. Verify sender email/domain
3. Create API Key
4. Add ke `.env`:

```bash
SENDGRID_API_KEY=SG.xxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

Update `lib/email-service.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationEmail(...) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Verify Your EduLearn Account",
    html: `...`
  };
  
  await sgMail.send(msg);
}
```

---

### **Option 3: AWS SES (Professional production)**

**Setup:**
1. Configure AWS SES
2. Verify email address
3. Create SMTP credentials
4. Add ke `.env`:

```bash
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

---

## **Current Setup Status**

✅ Email service configured untuk use Nodemailer dengan SMTP
✅ Verification code generation (6-digit random)
✅ 10 minutes expiry timer
✅ Beautiful HTML email template
✅ No testing codes in production response

---

## **How It Works**

### **1. User Signup**
- Fill form dengan name, email, password
- Verification code di-generate (6 digit)
- Email dikirim dengan code
- User redirect ke verify page (NO code ditampilkan)

### **2. User Verify**
- Input code dari email
- System verify code dan expiry
- Mark account as verified
- Redirect ke complete profile

### **3. Email Template**
Professional HTML email dengan:
- EduLearn branding
- 6-digit verification code
- 10 minutes expiry warning
- Clear instructions
- Support contact info

---

## **.env Configuration Template**

```bash
# Database
DATABASE_URL=mysql://user:password@localhost:3306/edulearn

# Email - Choose ONE option below:

# Option 1: Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Option 2: SendGrid (uncomment to use)
# SENDGRID_API_KEY=SG.xxxxxxxx
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Option 3: AWS SES (uncomment to use)
# SMTP_HOST=email-smtp.region.amazonaws.com
# SMTP_PORT=587
# SMTP_USER=your-smtp-user
# SMTP_PASSWORD=your-smtp-password
# SMTP_FROM=noreply@yourdomain.com
```

---

## **Production Checklist**

- [ ] Email service configured dan tested
- [ ] Domain/email verified dengan provider
- [ ] Rate limiting diterapkan (prevent brute force)
- [ ] Error handling robust (email send failures)
- [ ] Resend code functionality tested
- [ ] Email deliverability monitored
- [ ] No testing codes di production
- [ ] Proper CORS/security headers

---

## **Testing Locally**

Tanpa configure email provider:
- Code hanya di-log di server console
- Check server logs untuk verification code
- Gunakan code untuk test flow

Dengan email provider:
- Verification email langsung ke inbox
- Production-ready experience
- Professional appearance

---

## **Email Provider Recommendations**

| Provider | Best For | Free Tier | Setup Complexity |
|----------|----------|-----------|------------------|
| **Gmail** | Development/Testing | Yes | Simple |
| **SendGrid** | Growing Apps | 100 emails/day | Medium |
| **AWS SES** | Enterprise | Low cost | Complex |
| **Mailgun** | Developers | 5K emails/month | Medium |

---

**Pilih salah satu provider dan configure `.env` untuk production email verification!** 📧


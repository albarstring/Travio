# Gmail SMTP Setup untuk Email Verification

## Langkah-Langkah Setup Gmail SMTP

### 1. Enable 2-Factor Authentication di Google Account
- Buka https://myaccount.google.com/security
- Klik "2-Step Verification"
- Ikuti instruksi untuk enable 2FA

### 2. Generate App Password
- Buka https://myaccount.google.com/apppasswords
- Pilih "Mail" dan "Windows Computer" (atau device Anda)
- Google akan generate password 16 karakter
- Copy password ini

### 3. Setup Environment Variables

Di file `.env`, tambahkan:

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Contoh:**
```bash
GMAIL_USER=edulearn.app@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Restart Dev Server

```bash
npm run dev
```

---

## Cara Kerja Email Verification

### Saat User Signup:
1. User klik "Sign Up" di `/signup`
2. Server create user dengan verification code
3. **Email dikirim otomatis ke Gmail user** dengan code
4. User redirect ke `/verify-email`

### Email yang Dikirim:
- ✅ Beautiful HTML email template
- ✅ 6-digit verification code
- ✅ 10 minutes expiry warning
- ✅ Professional branding

### Saat Verification Success:
1. User input code dari email
2. Server verify code
3. **Welcome email dikirim** dengan link complete profile
4. User redirect ke `/complete-profile`

---

## Testing

### Test Account:
- Email: student1@test.com
- Password: password123

### Manual Test:
1. Buka http://localhost:3000/signup
2. Daftar dengan email real Anda
3. Check email Anda untuk verification code
4. Input code di verify page
5. Complete profile

---

## Troubleshooting

### Email tidak terkirim?

**Error: "Invalid login credentials"**
- Pastikan Gmail SMTP credentials benar di `.env`
- Generate app password baru dari Google Account

**Error: "Less secure app access"**
- 2FA sudah enabled? Jika tidak, enable dulu
- Gunakan App Password, bukan Gmail password biasa

**Email masuk ke Spam?**
- Check filter di Gmail Spam folder
- Tingkat delivery bisa diperbaiki dengan:
  - SPF/DKIM records (untuk production)
  - Consistent email sending

### Code tidak diterima?

- Check internet connection
- Verify code belum expired (10 menit)
- Bisa resend code dari verify page

---

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `GMAIL_USER` | your-email@gmail.com | Gmail account yang akan mengirim email |
| `GMAIL_APP_PASSWORD` | 16-char password | App password dari Google Account |
| `NEXT_PUBLIC_BASE_URL` | http://localhost:3000 | Base URL untuk email links |
| `DATABASE_URL` | mysql://user:pass@... | Database connection string |

---

## Production Considerations

### Setup Domain Email
Untuk production, gunakan domain email sendiri (bukan @gmail.com):
- SendGrid
- Mailgun
- AWS SES
- Custom SMTP server

### Email Templates
- Current template sudah professional
- Bisa customize branding/warna di `lib/email-service.ts`

### Rate Limiting
- Add rate limiting untuk prevent spam
- Implement retry logic untuk failed emails

### Monitoring
- Track email delivery rates
- Log all email sends
- Monitor bounces

---

**Sekarang user akan menerima email verification code langsung di Gmail mereka!** 📧✅










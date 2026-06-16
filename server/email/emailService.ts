import nodemailer from 'nodemailer'

const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN || ''
const senderEmail = process.env.SENDER_EMAIL || 'noreply@ufo-networks.org'
const contactAdminEmail = process.env.CONTACT_ADMIN_EMAIL || 'support@ufo-networks.org'
const appUrl = process.env.APP_URL || 'https://ufo-networks.org'

const transport = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: 'api',
    pass: MAILTRAP_TOKEN,
  },
})

function getUfoLogo() {
  return `
    <div style="text-align:center;margin:0 auto;">
      <div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;box-shadow:0 12px 30px rgba(24,95,249,0.25);">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8 5 5 9 5 13c0 4 3.6 8 7 9 3.4-1 7-5 7-9 0-4-3-8-7-11Z" stroke="white" stroke-width="1.6" opacity="0.95"/>
          <path d="M9.2 14.2c1.6 1.2 4 1.2 5.6 0" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M8.6 11.4c.9-.7 2.1-1.1 3.4-1.1s2.5.4 3.4 1.1" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>
        </svg>
      </div>
      <div style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.4px;line-height:1;">UFO Networks</div>
      <div style="color:#bfdbfe;font-size:13px;font-weight:700;margin-top:4px;line-height:1;">UFO WIFI Hotspots</div>
    </div>
  `
}

function emailFooter() {
  return `
    <tr>
      <td style="padding:0 34px 26px 34px;">
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:22px 0;" />
        <p style="font-size:0.85rem;color:#6b7280;text-align:center;margin:0;font-weight:700;">
          &copy; ${new Date().getFullYear()} UFO Networks — UFO WIFI Hotspots
        </p>
      </td>
    </tr>
  `
}

export async function sendPasswordResetEmail({ to, name, otpCode }: {
  to: string
  name: string
  otpCode: string
}) {
  try {
    const html = getPasswordResetTemplate({ name, otpCode })
    await transport.sendMail({
      from: senderEmail,
      to,
      subject: 'UFO Networks - Password Reset Code',
      html,
    })
    console.log(`[Password Reset Email] Sent to ${to}`)
  } catch (error: any) {
    console.error(`[Password Reset Email] Error sending to ${to}: ${error.message}`)
    throw error
  }
}

export async function sendPasswordResetConfirmationEmail({ to, name }: {
  to: string
  name: string
}) {
  try {
    const html = getPasswordResetConfirmationTemplate({ name })
    await transport.sendMail({
      from: senderEmail,
      to,
      subject: 'UFO Networks - Password Reset Successful',
      html,
    })
    console.log(`[Password Reset Confirmation Email] Sent to ${to}`)
  } catch (error: any) {
    console.error(`[Password Reset Confirmation Email] Error sending to ${to}: ${error.message}`)
    throw error
  }
}

export async function sendContactEmail({ firstName, lastName, email, phone, subject, message }: {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  try {
    const html = getContactEmailTemplate({ firstName, lastName, email, phone, subject, message })
    await transport.sendMail({
      from: senderEmail,
      to: contactAdminEmail,
      subject: `UFO Networks Contact Form: ${subject} - ${firstName} ${lastName}`,
      html,
    })
    console.log(`[Contact Email] Sent from ${email} to ${contactAdminEmail}`)
  } catch (error: any) {
    console.error(`[Contact Email] Error sending to ${contactAdminEmail}: ${error.message}`)
    throw error
  }
}

function getContactEmailTemplate({ firstName, lastName, email, phone, subject, message }: {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const subjectLabels: Record<string, string> = {
    general: 'General Inquiry',
    voucher: 'Voucher Support',
    technical: 'Technical Support',
    agent: 'Agent Application',
    partnership: 'Business Partnership',
    other: 'Other',
  }

  const subjectLabel = subjectLabels[subject] || subject

  return `
  <div style="background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);padding:0;margin:0;font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid rgba(24,95,249,0.15);">
            <tr>
              <td align="center" style="padding:34px 24px 26px 24px;background:linear-gradient(135deg,#185ff9 0%, #1f3b8a 100%);">
                ${getUfoLogo()}
                <h1 style="color:#ffffff;font-size:1.75rem;font-weight:800;margin:10px 0 0 0;letter-spacing:-0.4px;">New Contact Message</h1>
                <p style="color:rgba(255,255,255,0.9);font-size:1rem;margin:8px 0 0 0;font-weight:500;">Sent from the UFO Networks website</p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 34px 28px 34px;">
                <div style="background:linear-gradient(135deg,#f8fafc 0%, #eef2ff 100%);border-radius:16px;padding:24px;margin:0 0 22px 0;border-left:5px solid #185ff9;">
                  <h3 style="margin:0 0 16px 0;color:#1f2937;font-size:1.2rem;font-weight:800;">Contact Information</h3>
                  <div style="font-size:0.95rem;line-height:1.8;">
                    <div><strong style="color:#6b7280;">Name:</strong> <span style="color:#111827;font-weight:700;">${firstName} ${lastName}</span></div>
                    <div><strong style="color:#6b7280;">Email:</strong> <a href="mailto:${email}" style="color:#185ff9;text-decoration:none;font-weight:700;">${email}</a></div>
                    ${phone ? `<div><strong style="color:#6b7280;">Phone:</strong> <a href="tel:${phone}" style="color:#185ff9;text-decoration:none;font-weight:700;">${phone}</a></div>` : ''}
                    <div><strong style="color:#6b7280;">Subject:</strong> <span style="color:#111827;font-weight:700;">${subjectLabel}</span></div>
                  </div>
                </div>

                <div style="background:linear-gradient(135deg,#eff6ff 0%, #eef2ff 100%);border-radius:16px;padding:24px;margin:22px 0;border-left:5px solid #185ff9;">
                  <h3 style="margin:0 0 14px 0;color:#1f2937;font-size:1.2rem;font-weight:800;">Message</h3>
                  <div style="background:#ffffff;padding:18px;border-radius:12px;border:1px solid #e5e7eb;">
                    <p style="color:#111827;line-height:1.7;margin:0;white-space:pre-wrap;font-size:1rem;">${message}</p>
                  </div>
                </div>

                <div style="background:linear-gradient(135deg,#f8fafc 0%, #eef2ff 100%);border-radius:12px;padding:18px;margin:22px 0;border-left:4px solid #185ff9;">
                  <a href="mailto:${email}?subject=Re: ${subjectLabel}" style="display:inline-block;background:#185ff9;color:#ffffff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:800;font-size:0.95rem;">
                    Reply to ${firstName}
                  </a>
                  <p style="margin:12px 0 0 0;color:#6b7280;font-size:0.9rem;">
                    Received: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Harare' })}
                  </p>
                </div>
              </td>
            </tr>
            ${emailFooter()}
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

function getPasswordResetConfirmationTemplate({ name }: { name: string }) {
  return `
  <div style="background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);padding:0;margin:0;font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid rgba(24,95,249,0.15);">
            <tr>
              <td align="center" style="padding:34px 24px 26px 24px;background:linear-gradient(135deg,#185ff9 0%, #1f3b8a 100%);">
                ${getUfoLogo()}
                <h1 style="color:#ffffff;font-size:1.75rem;font-weight:800;margin:10px 0 0 0;letter-spacing:-0.4px;">Password Reset Successful</h1>
                <p style="color:rgba(255,255,255,0.9);font-size:1rem;margin:8px 0 0 0;font-weight:500;">Your account is now protected</p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 34px 28px 34px;">
                <p style="font-size:1.15rem;color:#111827;margin:0 0 14px 0;line-height:1.6;font-weight:500;">
                  Hello <strong style="color:#185ff9;">${name}</strong>,
                </p>
                <p style="font-size:1.05rem;color:#4b5563;margin:0 0 18px 0;line-height:1.7;">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>

                <div style="background:linear-gradient(135deg,#eff6ff 0%, #eef2ff 100%);border-radius:16px;padding:26px;margin:24px 0;border:1px solid rgba(24,95,249,0.18);text-align:center;">
                  <div style="font-size:3.25rem;margin-bottom:10px;">✅</div>
                  <h3 style="margin:0;color:#111827;font-size:1.2rem;font-weight:900;">All set!</h3>
                  <p style="margin:8px 0 0 0;color:#4b5563;font-weight:600;">You can continue using UFO Networks safely.</p>
                </div>

                <p style="font-size:1rem;color:#4b5563;margin:0 0 22px 0;line-height:1.7;">
                  If you didn&apos;t request this reset, please contact our support team immediately.
                </p>

                <a href="${appUrl}/login" style="display:inline-block;background:#185ff9;color:#ffffff;font-weight:900;padding:14px 34px;border-radius:12px;text-decoration:none;font-size:1.05rem;box-shadow:0 10px 25px rgba(24,95,249,0.25);">
                  Sign In
                </a>
              </td>
            </tr>
            ${emailFooter()}
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

function getPasswordResetTemplate({ name, otpCode }: { name: string, otpCode: string }) {
  return `
  <div style="background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);padding:0;margin:0;font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#185ff9 0%, #2d3040 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="560" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid rgba(24,95,249,0.15);">
            <tr>
              <td align="center" style="padding:34px 24px 26px 24px;background:linear-gradient(135deg,#185ff9 0%, #1f3b8a 100%);">
                ${getUfoLogo()}
                <h1 style="color:#ffffff;font-size:1.75rem;font-weight:800;margin:10px 0 0 0;letter-spacing:-0.4px;">Password Reset</h1>
                <p style="color:rgba(255,255,255,0.9);font-size:1rem;margin:8px 0 0 0;font-weight:500;">Use the code below to reset your password</p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 34px 28px 34px;">
                <p style="font-size:1.15rem;color:#111827;margin:0 0 14px 0;line-height:1.6;font-weight:600;">
                  Hello <strong style="color:#185ff9;">${name}</strong>,
                </p>
                <p style="font-size:1.05rem;color:#4b5563;margin:0 0 18px 0;line-height:1.7;">
                  We received a request to reset your password. Use the verification code below to complete the process.
                </p>

                <div style="background:linear-gradient(135deg,#f8fafc 0%, #eef2ff 100%);border-radius:16px;padding:26px;margin:24px 0;text-align:center;border:1px solid #e5e7eb;">
                  <h3 style="margin:0 0 10px 0;color:#111827;font-size:1.05rem;font-weight:900;">Your Verification Code</h3>
                  <div style="font-size:3.15rem;font-weight:900;color:#185ff9;letter-spacing:0.25rem;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;margin:14px 0 8px 0;">${otpCode}</div>
                  <p style="font-size:0.95rem;color:#6b7280;margin:0;font-weight:700;">This code will expire in 10 minutes</p>
                </div>

                <p style="font-size:1rem;color:#4b5563;margin:0 0 22px 0;line-height:1.7;">
                  If you didn&apos;t request this password reset, please ignore this email.
                </p>
              </td>
            </tr>
            ${emailFooter()}
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

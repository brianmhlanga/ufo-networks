import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '137328aecc402e',
    pass: '314e08c03d6645'
  }
})

export async function sendAdminStatsEmail(stats: any) {
  // Send to all admin users
  for (const adminUser of stats.adminUsers) {
    try {
      const html = getAdminStatsTemplate(adminUser.firstName, stats)
      await transport.sendMail({
        from: 'noreply@review.co.zw',
        to: adminUser.email,
        subject: `Daily Admin Statistics Report - ${stats.reportDate}`,
        html
      })
      console.log(`[Admin Stats Email] Sent to ${adminUser.email}`)
    } catch (error: any) {
      console.error(`[Admin Stats Email] Error sending to ${adminUser.email}: ${error.message}`)
    }
  }
}

function getAdminStatsTemplate(adminName: string, stats: any) {
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #2c3e50 0%, #34495e 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:2rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Daily Admin Report</h1>
                <p style="color:#ecf0f1;font-size:1.1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">${stats.reportDate} - Platform Statistics</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">Good morning <strong style="color:#3498db;">${adminName}</strong>,</p>
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 32px 0;line-height:1.7;">Here's your daily overview of the review.co.zw platform statistics for ${stats.reportDate}.</p>
                
                <!-- Growth Overview -->
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #27ae60;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.3rem;font-weight:600;">📈 Yesterday's Growth</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#27ae60;">${stats.newUsersYesterday}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">New Users</div>
                      <div style="font-size:0.8rem;color:#27ae60;">+${stats.userGrowthPercentage}%</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#3498db;">${stats.newCompaniesYesterday}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">New Companies</div>
                      <div style="font-size:0.8rem;color:#3498db;">+${stats.companyGrowthPercentage}%</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#e67e22;">${stats.newReviewsYesterday}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">New Reviews</div>
                      <div style="font-size:0.8rem;color:#e67e22;">+${stats.reviewGrowthPercentage}%</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#9b59b6;">${stats.newSubscriptionsYesterday}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">New Subscriptions</div>
                      <div style="font-size:0.8rem;color:#9b59b6;">+${stats.subscriptionGrowthPercentage}%</div>
                    </div>
                  </div>
                </div>

                <!-- Pending Items Alert -->
                <div style="background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #f39c12;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.3rem;font-weight:600;">⚠️ Items Requiring Attention</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#e74c3c;">${stats.pendingReviews}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">Pending Reviews</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#e74c3c;">${stats.pendingComments}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">Pending Comments</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#e74c3c;">${stats.pendingReports}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">Pending Reports</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.7);border-radius:12px;">
                      <div style="font-size:2rem;font-weight:700;color:#e74c3c;">${stats.pendingCompanyResponses}</div>
                      <div style="font-size:0.9rem;color:#5a6c7d;">Pending Responses</div>
                    </div>
                  </div>
                </div>

                <!-- Platform Overview -->
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #6c757d;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.3rem;font-weight:600;">📊 Platform Overview</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div style="background:white;padding:20px;border-radius:12px;border-left:4px solid #3498db;">
                      <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1.1rem;">Users</h4>
                      <div style="font-size:1.5rem;font-weight:700;color:#3498db;">${stats.totalUsers.toLocaleString()}</div>
                      <div style="font-size:0.8rem;color:#7f8c8d;margin-top:4px;">
                        ${stats.verifiedUsers} verified • ${stats.suspendedUsers} suspended • ${stats.blacklistedUsers} blacklisted
                      </div>
                    </div>
                    <div style="background:white;padding:20px;border-radius:12px;border-left:4px solid #e67e22;">
                      <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1.1rem;">Companies</h4>
                      <div style="font-size:1.5rem;font-weight:700;color:#e67e22;">${stats.totalCompanies.toLocaleString()}</div>
                      <div style="font-size:0.8rem;color:#7f8c8d;margin-top:4px;">
                        ${stats.verifiedCompanies} verified • ${stats.claimedCompanies} claimed • ${stats.activeCompanies} active
                      </div>
                    </div>
                    <div style="background:white;padding:20px;border-radius:12px;border-left:4px solid #27ae60;">
                      <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1.1rem;">Reviews</h4>
                      <div style="font-size:1.5rem;font-weight:700;color:#27ae60;">${stats.totalReviews.toLocaleString()}</div>
                      <div style="font-size:0.8rem;color:#7f8c8d;margin-top:4px;">
                        ${stats.approvedReviews} approved • ${stats.verifiedReviews} verified • ${stats.rejectedReviews} rejected
                      </div>
                    </div>
                    <div style="background:white;padding:20px;border-radius:12px;border-left:4px solid #9b59b6;">
                      <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1.1rem;">Subscriptions</h4>
                      <div style="font-size:1.5rem;font-weight:700;color:#9b59b6;">${stats.totalSubscriptions.toLocaleString()}</div>
                      <div style="font-size:0.8rem;color:#7f8c8d;margin-top:4px;">
                        ${stats.activeSubscriptions} active • ${stats.paidSubscriptions} paid • ${stats.expiredSubscriptions} expired
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Statistics -->
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #6c757d;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.3rem;font-weight:600;">📋 Additional Statistics</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;font-size:0.9rem;">
                    <div><strong>Comments:</strong> ${stats.totalComments.toLocaleString()} (${stats.pendingComments} pending)</div>
                    <div><strong>Company Responses:</strong> ${stats.totalCompanyResponses.toLocaleString()} (${stats.pendingCompanyResponses} pending)</div>
                    <div><strong>Reports:</strong> ${stats.totalReports.toLocaleString()} (${stats.pendingReports} pending)</div>
                    <div><strong>Payments:</strong> ${stats.totalPayments.toLocaleString()} (${stats.successfulPayments} successful)</div>
                    <div><strong>Company Users:</strong> ${stats.totalCompanyUsers.toLocaleString()} (${stats.activeCompanyUsers} active)</div>
                    <div><strong>Company Invites:</strong> ${stats.totalCompanyInvites.toLocaleString()} (${stats.pendingCompanyInvites} pending)</div>
                    <div><strong>Review Votes:</strong> ${stats.totalReviewVotes.toLocaleString()} (${stats.approvedReviewVotes} approved)</div>
                    <div><strong>Categories:</strong> ${stats.totalCategories.toLocaleString()} (${stats.activeCategories} active)</div>
                    <div><strong>Images:</strong> ${stats.totalImages.toLocaleString()} (${stats.newImagesYesterday} new)</div>
                  </div>
                </div>

                <!-- System Statistics -->
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #6c757d;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.3rem;font-weight:600;">⚙️ System Statistics</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;font-size:0.9rem;">
                    <div><strong>System Settings:</strong> ${stats.totalSystemSettings} (${stats.activeSystemSettings} active)</div>
                    <div><strong>Email Templates:</strong> ${stats.totalEmailTemplates} (${stats.activeEmailTemplates} active)</div>
                    <div><strong>Feature Flags:</strong> ${stats.totalFeatureFlags} (${stats.enabledFeatureFlags} enabled)</div>
                    <div><strong>API Keys:</strong> ${stats.totalApiKeys} (${stats.activeApiKeys} active)</div>
                    <div><strong>Webhooks:</strong> ${stats.totalWebhooks} (${stats.activeWebhooks} active)</div>
                    <div><strong>Maintenance Windows:</strong> ${stats.totalMaintenanceWindows} (${stats.activeMaintenanceWindows} active)</div>
                    <div><strong>User Suspensions:</strong> ${stats.totalUserSuspensions} (${stats.activeUserSuspensions} active)</div>
                    <div><strong>User Blacklists:</strong> ${stats.totalUserBlacklists}</div>
                    <div><strong>Admin Users:</strong> ${stats.adminUsers.length}</div>
                  </div>
                </div>

                <a href="https://review.co.zw/admin" style="display:inline-block;background:linear-gradient(135deg, #3498db 0%, #2980b9 100%);color:#ffffff;font-weight:600;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 8px 24px rgba(52,152,219,0.3);margin:32px 0 24px 0;transition:all 0.3s ease;border:none;">Access Admin Dashboard</a>
                
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #27ae60;">
                  <p style="font-size:0.95rem;color:#2c3e50;margin:0;line-height:1.6;font-weight:500;">
                    <strong style="color:#27ae60;">Need to take action?</strong> Use the admin dashboard to review pending items, manage users, and monitor platform activity.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Daily Admin Statistics Report</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  const html = getWelcomeTemplate(firstName)
  await transport.sendMail({
    from: 'noreply@review.co.zw',
    to,
    subject: 'Welcome to review.co.zw!',
    html
  })
}

function getWelcomeTemplate(firstName: string) {
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #2c3e50 0%, #34495e 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:2.2rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Welcome, ${firstName}!</h1>
                <p style="color:#ecf0f1;font-size:1.1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">Your journey begins here</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">We are delighted to welcome you to <strong style="color:#3498db;">review.co.zw</strong>, the premier platform for authentic business reviews and insights.</p>
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 32px 0;line-height:1.7;">Join our growing community of discerning consumers and business professionals who rely on honest, comprehensive reviews to make informed decisions.</p>
                
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:12px;padding:24px;margin:32px 0;border-left:4px solid #3498db;">
                  <h3 style="margin:0 0 16px 0;color:#2c3e50;font-size:1.1rem;font-weight:600;">What you can do:</h3>
                  <ul style="margin:0;padding-left:20px;color:#5a6c7d;line-height:1.6;">
                    <li style="margin-bottom:8px;">Explore and review businesses across various industries</li>
                    <li style="margin-bottom:8px;">Share authentic experiences to help others</li>
                    <li style="margin-bottom:8px;">Access detailed insights and ratings</li>
                    <li style="margin-bottom:0;">Connect with a community of trusted reviewers</li>
                  </ul>
                </div>
                
                <a href="https://review.co.zw/login" style="display:inline-block;background:linear-gradient(135deg, #3498db 0%, #2980b9 100%);color:#ffffff;font-weight:600;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 8px 24px rgba(52,152,219,0.3);margin-bottom:24px;transition:all 0.3s ease;border:none;">Access Your Account</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <p style="font-size:0.95rem;color:#7f8c8d;margin:0 0 12px 0;line-height:1.5;">If you did not create this account, please disregard this email or contact our support team immediately.</p>
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Empowering informed decisions through authentic reviews</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

export async function sendPaymentReminderEmail(to: string, firstName: string, companyName: string, planName: string, planPrice: number, expiryDate: string, daysUntilExpiry: number) {
  const html = getPaymentReminderTemplate(firstName, companyName, planName, planPrice, expiryDate, daysUntilExpiry)
  await transport.sendMail({
    from: 'noreply@review.co.zw',
    to,
    subject: `Payment Reminder: Your ${companyName} subscription expires in ${daysUntilExpiry} days`,
    html
  })
}

function getPaymentReminderTemplate(firstName: string, companyName: string, planName: string, planPrice: number, expiryDate: string, daysUntilExpiry: number) {
  const formattedPrice = planPrice === 0 ? 'Free' : `$${planPrice.toFixed(2)}`
  
  // Enhanced urgency colors with gradients
  let urgencyGradient, urgencyText, urgencyAccent
  if (daysUntilExpiry <= 3) {
    urgencyGradient = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    urgencyText = 'URGENT RENEWAL REQUIRED'
    urgencyAccent = '#e74c3c'
  } else if (daysUntilExpiry <= 7) {
    urgencyGradient = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
    urgencyText = 'RENEWAL DUE SOON'
    urgencyAccent = '#f39c12'
  } else {
    urgencyGradient = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
    urgencyText = 'SUBSCRIPTION RENEWAL REMINDER'
    urgencyAccent = '#3498db'
  }
  
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:${urgencyGradient};">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:1.8rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${urgencyText}</h1>
                <p style="color:#ecf0f1;font-size:1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">Action Required</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">Dear <strong style="color:#3498db;">${firstName}</strong>,</p>
                <p style="font-size:1.1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">We would like to inform you that your subscription for <strong style="color:#2c3e50;">${companyName}</strong> will expire in <span style="color:${urgencyAccent};font-weight:700;font-size:1.2rem;">${daysUntilExpiry} days</span> on <strong style="color:#2c3e50;">${expiryDate}</strong>.</p>
                
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid ${urgencyAccent};box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.2rem;font-weight:600;display:flex;align-items:center;">
                    <span style="background:${urgencyAccent};color:white;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:0.9rem;">ℹ</span>
                    Subscription Details
                  </h3>
                  <div style="display:flex;justify-content:space-between;margin:12px 0;padding:8px 0;border-bottom:1px solid #ecf0f1;">
                    <span style="color:#7f8c8d;font-weight:500;">Plan:</span>
                    <span style="font-weight:600;color:#2c3e50;">${planName}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin:12px 0;padding:8px 0;border-bottom:1px solid #ecf0f1;">
                    <span style="color:#7f8c8d;font-weight:500;">Price:</span>
                    <span style="font-weight:600;color:#2c3e50;">${formattedPrice}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin:12px 0;padding:8px 0;">
                    <span style="color:#7f8c8d;font-weight:500;">Expires:</span>
                    <span style="font-weight:600;color:#2c3e50;">${expiryDate}</span>
                  </div>
                </div>
                
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 32px 0;line-height:1.7;">To ensure uninterrupted access to our premium features and maintain your business presence, we strongly recommend renewing your subscription before the expiration date.</p>
                
                <a href="https://review.co.zw/company/dashboard" style="display:inline-block;background:${urgencyGradient};color:#ffffff;font-weight:600;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 8px 24px rgba(0,0,0,0.2);margin-bottom:24px;transition:all 0.3s ease;border:none;">Renew Subscription Now</a>
                
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #27ae60;">
                  <p style="font-size:0.95rem;color:#2c3e50;margin:0;line-height:1.6;font-weight:500;">
                    <strong style="color:#27ae60;">Need assistance?</strong> Our dedicated support team is available to help you with any questions regarding your subscription or account management.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Empowering informed decisions through authentic reviews</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

export async function sendSubscriptionDowngradeEmail(to: string, firstName: string, companyName: string, planName: string, planPrice: number) {
  const html = getSubscriptionDowngradeTemplate(firstName, companyName, planName, planPrice)
  await transport.sendMail({
    from: 'noreply@review.co.zw',
    to,
    subject: `Subscription Update: ${companyName} has been downgraded to the free plan`,
    html
  })
}

function getSubscriptionDowngradeTemplate(firstName: string, companyName: string, planName: string, planPrice: number) {
  const formattedPrice = planPrice === 0 ? 'Free' : `$${planPrice.toFixed(2)}`
  
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:1.8rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">SUBSCRIPTION UPDATED</h1>
                <p style="color:#ecf0f1;font-size:1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">Plan Change Notification</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">Dear <strong style="color:#3498db;">${firstName}</strong>,</p>
                <p style="font-size:1.1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">We would like to inform you that your subscription for <strong style="color:#2c3e50;">${companyName}</strong> has been automatically downgraded to our free plan due to expiration of your previous subscription.</p>
                
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #95a5a6;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.2rem;font-weight:600;display:flex;align-items:center;">
                    <span style="background:#95a5a6;color:white;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:0.9rem;">ℹ</span>
                    New Subscription Details
                  </h3>
                  <div style="display:flex;justify-content:space-between;margin:12px 0;padding:8px 0;border-bottom:1px solid #ecf0f1;">
                    <span style="color:#7f8c8d;font-weight:500;">Plan:</span>
                    <span style="font-weight:600;color:#2c3e50;">${planName}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin:12px 0;padding:8px 0;">
                    <span style="color:#7f8c8d;font-weight:500;">Price:</span>
                    <span style="font-weight:600;color:#2c3e50;">${formattedPrice}</span>
                  </div>
                </div>
                
                <div style="background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:12px;padding:24px;margin:24px 0;border-left:4px solid #f39c12;">
                  <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1.1rem;font-weight:600;">What this means:</h4>
                  <ul style="margin:0;padding-left:20px;color:#5a6c7d;line-height:1.6;">
                    <li style="margin-bottom:8px;">Your company profile remains active and visible</li>
                    <li style="margin-bottom:8px;">Basic features are still available</li>
                    <li style="margin-bottom:8px;">Some premium features may be limited</li>
                    <li style="margin-bottom:0;">You can upgrade anytime to restore full access</li>
                  </ul>
                </div>
                
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 32px 0;line-height:1.7;">To restore access to all premium features and enhance your business presence, you can upgrade your subscription at any time through your company dashboard.</p>
                
                <a href="https://review.co.zw/company/dashboard" style="display:inline-block;background:linear-gradient(135deg, #3498db 0%, #2980b9 100%);color:#ffffff;font-weight:600;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 8px 24px rgba(52,152,219,0.3);margin-bottom:24px;transition:all 0.3s ease;border:none;">Upgrade Subscription</a>
                
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #27ae60;">
                  <p style="font-size:0.95rem;color:#2c3e50;margin:0;line-height:1.6;font-weight:500;">
                    <strong style="color:#27ae60;">Questions?</strong> Our support team is here to help you understand the changes and assist with any upgrade questions you may have.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Empowering informed decisions through authentic reviews</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

export async function sendReviewInvitationEmail({ to, name, companyName, invitationId, companyId, message }: {
  to: string
  name: string
  companyName: string
  invitationId: string
  companyId: string
  message: string
}) {
  const html = getReviewInvitationTemplate(name, companyName, invitationId, companyId, message)
  await transport.sendMail({
    from: 'noreply@review.co.zw',
    to,
    subject: `You're invited to review ${companyName} on review.co.zw`,
    html
  })
}

export async function sendPasswordResetEmail({ to, name, otpCode }: {
  to: string
  name: string
  otpCode: string
}) {
  try {
    const html = getPasswordResetTemplate({ name, otpCode })
    await transport.sendMail({
      from: 'noreply@review.co.zw',
      to,
      subject: 'Password Reset Code - review.co.zw',
      html
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
      from: 'noreply@review.co.zw',
      to,
      subject: 'Password Reset Successful - review.co.zw',
      html
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
      from: 'noreply@review.co.zw',
      to: 'admin@review.co.zw',
      subject: `Contact Form: ${subject} - ${firstName} ${lastName}`,
      html
    })
    console.log(`[Contact Email] Sent from ${email} to admin@review.co.zw`)
  } catch (error: any) {
    console.error(`[Contact Email] Error sending to admin@review.co.zw: ${error.message}`)
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
  const subjectLabels: { [key: string]: string } = {
    general: 'General Inquiry',
    business_claim: 'Business Claim Support',
    technical: 'Technical Support',
    account: 'Account Issues',
    billing: 'Billing & Subscriptions',
    report: 'Report Inappropriate Content',
    partnership: 'Partnership Opportunities',
    feature_request: 'Feature Request',
    bug_report: 'Bug Report',
    other: 'Other'
  }

  const subjectLabel = subjectLabels[subject] || 'General Inquiry'
  
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:1.8rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">New Contact Message</h1>
                <p style="color:#ecf0f1;font-size:1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">From review.co.zw contact form</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:28px;margin:0 0 32px 0;border-left:5px solid #3498db;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.2rem;font-weight:600;">📧 Contact Information</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:0.95rem;">
                    <div>
                      <strong style="color:#7f8c8d;">Name:</strong><br>
                      <span style="color:#2c3e50;font-weight:500;">${firstName} ${lastName}</span>
                    </div>
                    <div>
                      <strong style="color:#7f8c8d;">Email:</strong><br>
                      <a href="mailto:${email}" style="color:#3498db;text-decoration:none;font-weight:500;">${email}</a>
                    </div>
                    ${phone ? `
                    <div>
                      <strong style="color:#7f8c8d;">Phone:</strong><br>
                      <a href="tel:${phone}" style="color:#3498db;text-decoration:none;font-weight:500;">${phone}</a>
                    </div>
                    ` : ''}
                    <div>
                      <strong style="color:#7f8c8d;">Subject:</strong><br>
                      <span style="color:#2c3e50;font-weight:500;">${subjectLabel}</span>
                    </div>
                  </div>
                </div>

                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:16px;padding:28px;margin:32px 0;border-left:5px solid #27ae60;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h3 style="margin:0 0 20px 0;color:#2c3e50;font-size:1.2rem;font-weight:600;">💬 Message</h3>
                  <div style="background:white;padding:20px;border-radius:12px;border:1px solid #e9ecef;">
                    <p style="color:#2c3e50;line-height:1.7;margin:0;white-space:pre-wrap;font-size:1rem;">${message}</p>
                  </div>
                </div>

                <div style="background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #f39c12;">
                  <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1rem;font-weight:600;">📋 Quick Actions</h4>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.9rem;">
                    <a href="mailto:${email}?subject=Re: ${subjectLabel}" style="display:inline-block;background:#3498db;color:white;padding:8px 16px;border-radius:8px;text-decoration:none;text-align:center;font-weight:500;">Reply to ${firstName}</a>
                    <a href="https://review.co.zw/admin" style="display:inline-block;background:#27ae60;color:white;padding:8px 16px;border-radius:8px;text-decoration:none;text-align:center;font-weight:500;">Admin Dashboard</a>
                  </div>
                </div>

                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #6c757d;">
                  <p style="font-size:0.95rem;color:#2c3e50;margin:0;line-height:1.6;font-weight:500;">
                    <strong style="color:#6c757d;">Message Details:</strong><br>
                    • Received: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Harare' })}<br>
                    • Form: review.co.zw Contact Page<br>
                    • IP: [Auto-detected by system]
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Contact Form Notification</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

function getPasswordResetConfirmationTemplate({ name }: { name: string }) {
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:1.8rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Password Reset Successful</h1>
                <p style="color:#ecf0f1;font-size:1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">Your account is now secure</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">Hello <strong style="color:#3498db;">${name}</strong>,</p>
                <p style="font-size:1.1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">Your password has been successfully reset for your review.co.zw account. You can now sign in with your new password.</p>
                
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:16px;padding:32px;margin:32px 0;text-align:center;border:2px solid #27ae60;">
                  <div style="font-size:4rem;margin-bottom:16px;">✅</div>
                  <h3 style="margin:0 0 16px 0;color:#2c3e50;font-size:1.2rem;font-weight:600;">Password Reset Complete</h3>
                  <p style="font-size:1rem;color:#5a6c7d;margin:0;">Your account is now secure with your new password</p>
                </div>
                
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">If you did not request this password reset, please contact our support team immediately as your account may have been compromised.</p>
                
                <a href="https://review.co.zw/login" style="display:inline-block;background:linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);color:#ffffff;font-weight:600;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 8px 24px rgba(39,174,96,0.3);margin-bottom:24px;transition:all 0.3s ease;border:none;">Sign In Now</a>
                
                <div style="background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #f39c12;">
                  <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1rem;font-weight:600;">Security Reminders:</h4>
                  <ul style="margin:0;padding-left:20px;color:#5a6c7d;line-height:1.6;">
                    <li style="margin-bottom:8px;">Keep your password secure and don't share it with anyone</li>
                    <li style="margin-bottom:8px;">Use a strong, unique password for each account</li>
                    <li style="margin-bottom:8px;">Enable two-factor authentication if available</li>
                    <li style="margin-bottom:0;">Regularly review your account activity for any suspicious activity</li>
                  </ul>
                </div>
                
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #27ae60;">
                  <p style="font-size:0.95rem;color:#2c3e50;margin:0;line-height:1.6;font-weight:500;">
                    <strong style="color:#27ae60;">Need help?</strong> Our support team is here to assist you with any questions about your account security.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Empowering informed decisions through authentic reviews</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

function getPasswordResetTemplate({ name, otpCode }: { name: string, otpCode: string }) {
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:1.8rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Password Reset</h1>
                <p style="color:#ecf0f1;font-size:1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">Secure access to your account</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">Hello <strong style="color:#3498db;">${name}</strong>,</p>
                <p style="font-size:1.1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">We received a request to reset your password for your review.co.zw account. Use the verification code below to complete the process.</p>
                
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:16px;padding:32px;margin:32px 0;text-align:center;border:2px dashed #dee2e6;">
                  <h3 style="margin:0 0 16px 0;color:#2c3e50;font-size:1.1rem;font-weight:600;">Your Verification Code</h3>
                  <div style="font-size:3rem;font-weight:700;color:#e74c3c;letter-spacing:0.5rem;font-family:'Courier New', monospace;margin:16px 0;">${otpCode}</div>
                  <p style="font-size:0.9rem;color:#6c757d;margin:0;">This code will expire in 10 minutes</p>
                </div>
                
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">If you didn't request this password reset, please ignore this email. Your account security is important to us.</p>
                
                <div style="background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #f39c12;">
                  <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1rem;font-weight:600;">Security Tips:</h4>
                  <ul style="margin:0;padding-left:20px;color:#5a6c7d;line-height:1.6;">
                    <li style="margin-bottom:8px;">Never share this code with anyone</li>
                    <li style="margin-bottom:8px;">Use a strong, unique password</li>
                    <li style="margin-bottom:8px;">Enable two-factor authentication if available</li>
                    <li style="margin-bottom:0;">Contact support if you suspect unauthorized access</li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Empowering informed decisions through authentic reviews</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}

function getReviewInvitationTemplate(name: string, companyName: string, invitationId: string, companyId: string, message: string) {
  const reviewUrl = `https://review.co.zw/write-review-${companyId}-${invitationId}`
  
  return `
  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;min-height:100vh;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:0;margin:0;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:20px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #f0f0f0;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
                <img src="https://review.co.zw/logo.png" alt="review.co.zw" width="64" height="64" style="display:block;margin:0 auto 16px auto;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.2);" />
                <h1 style="color:#ffffff;font-size:1.8rem;font-weight:600;margin:0;letter-spacing:-0.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Review Invitation</h1>
                <p style="color:#ecf0f1;font-size:1rem;margin:8px 0 0 0;font-weight:300;opacity:0.9;">Share your experience with ${companyName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 30px 40px;">
                <p style="font-size:1.2rem;color:#2c3e50;margin:0 0 20px 0;line-height:1.6;font-weight:400;">Hello <strong style="color:#3498db;">${name}</strong>,</p>
                <p style="font-size:1.1rem;color:#5a6c7d;margin:0 0 24px 0;line-height:1.7;">You have been invited to share your experience and review <strong style="color:#2c3e50;">${companyName}</strong> on review.co.zw.</p>
                
                ${message ? `
                <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #3498db;">
                  <p style="font-size:1rem;color:#5a6c7d;margin:0;line-height:1.6;font-style:italic;">"${message}"</p>
                </div>
                ` : ''}
                
                <p style="font-size:1rem;color:#5a6c7d;margin:0 0 32px 0;line-height:1.7;">Your honest feedback helps other customers make informed decisions and helps businesses improve their services.</p>
                
                <a href="${reviewUrl}" style="display:inline-block;background:linear-gradient(135deg, #3498db 0%, #2980b9 100%);color:#ffffff;font-weight:600;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:1.1rem;box-shadow:0 8px 24px rgba(52,152,219,0.3);margin-bottom:24px;transition:all 0.3s ease;border:none;">Write Your Review</a>
                
                <div style="background:linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #27ae60;">
                  <h4 style="margin:0 0 12px 0;color:#2c3e50;font-size:1.1rem;font-weight:600;">What to expect:</h4>
                  <ul style="margin:0;padding-left:20px;color:#5a6c7d;line-height:1.6;">
                    <li style="margin-bottom:8px;">Share your honest experience and rating</li>
                    <li style="margin-bottom:8px;">Help other customers make informed decisions</li>
                    <li style="margin-bottom:8px;">Contribute to the community of authentic reviews</li>
                    <li style="margin-bottom:0;">Your review will be visible to thousands of users</li>
                  </ul>
                </div>
                
                <p style="font-size:0.95rem;color:#7f8c8d;margin:0 0 12px 0;line-height:1.5;">If you don't have an account yet, you'll be prompted to create one when you click the review button.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <hr style="border:none;border-top:1px solid #ecf0f1;margin:32px 0;" />
                <p style="font-size:0.9rem;color:#95a5a6;text-align:center;margin:0;font-weight:400;">&copy; ${new Date().getFullYear()} review.co.zw &mdash; Empowering informed decisions through authentic reviews</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `
}
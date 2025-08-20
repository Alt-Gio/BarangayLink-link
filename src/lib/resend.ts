import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 'mock_key_for_build');

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@barangaylink.com';
const FROM_NAME = process.env.FROM_NAME || 'BarangayLink System';

// Email templates
export const EmailTemplates = {
  // User authentication emails
  welcomeEmail: (userName: string, dashboardUrl: string) => ({
    subject: 'Welcome to BarangayLink!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to BarangayLink</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${userName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Welcome to BarangayLink, your comprehensive barangay management system. 
            You now have access to powerful tools for project management, event coordination, 
            and community engagement.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Getting Started</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>Complete your profile setup</li>
              <li>Explore the dashboard and available modules</li>
              <li>Join project teams and view assigned tasks</li>
              <li>Stay updated with community events and announcements</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you need help getting started, please contact your barangay administrator.
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 BarangayLink. Empowering communities through technology.
          </p>
        </div>
      </div>
    `
  }),

  // Project notifications
  projectAssignment: (userName: string, projectTitle: string, projectUrl: string, assignedBy: string) => ({
    subject: `You've been assigned to: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3b82f6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Project Assignment</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hello ${userName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            You have been assigned to work on a new project: <strong>${projectTitle}</strong>
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #4b5563;">
              <strong>Assigned by:</strong> ${assignedBy}<br>
              <strong>Project:</strong> ${projectTitle}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${projectUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block;">
              View Project Details
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Task notifications
  taskAssignment: (userName: string, taskTitle: string, taskUrl: string, dueDate?: string) => ({
    subject: `New Task: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8b5cf6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Task Assignment</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hello ${userName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            You have been assigned a new task: <strong>${taskTitle}</strong>
          </p>
          
          ${dueDate ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                <strong>Due Date:</strong> ${dueDate}
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${taskUrl}" 
               style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block;">
              View Task
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Event notifications
  eventInvitation: (userName: string, eventTitle: string, eventDate: string, eventLocation: string, eventUrl: string) => ({
    subject: `Event Invitation: ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">You're Invited!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hello ${userName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            You're invited to attend: <strong>${eventTitle}</strong>
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">Event Details</h3>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Event:</strong> ${eventTitle}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${eventUrl}" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block;">
              View Event Details
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Announcement notifications
  urgentAnnouncement: (title: string, content: string, announcementUrl: string) => ({
    subject: `🚨 URGENT: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚨 URGENT ANNOUNCEMENT</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #dc2626;">${title}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="color: #4b5563; line-height: 1.6; margin: 0;">
              ${content}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${announcementUrl}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block;">
              Read Full Announcement
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // System notifications
  passwordReset: (userName: string, resetUrl: string) => ({
    subject: 'Password Reset Request - BarangayLink',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6b7280; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hello ${userName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We received a request to reset your password for your BarangayLink account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this password reset, please ignore this email. 
            This link will expire in 24 hours.
          </p>
        </div>
      </div>
    `
  }),
};

// Send email function
export const sendEmail = async (
  to: string | string[],
  template: ReturnType<typeof EmailTemplates[keyof typeof EmailTemplates]>,
  options?: {
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }
) => {
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject: template.subject,
      html: template.html,
      cc: options?.cc,
      bcc: options?.bcc,
      reply_to: options?.replyTo,
      attachments: options?.attachments,
    });

    console.log('Email sent successfully:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

// Bulk email sending for announcements
export const sendBulkEmails = async (
  recipients: Array<{ email: string; name: string; data?: Record<string, any> }>,
  templateFn: (name: string, data?: Record<string, any>) => ReturnType<typeof EmailTemplates[keyof typeof EmailTemplates]>
) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const template = templateFn(recipient.name, recipient.data);
      const result = await sendEmail(recipient.email, template);
      results.push({ email: recipient.email, ...result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to send email to ${recipient.email}:`, error);
      results.push({ email: recipient.email, success: false, error });
    }
  }
  
  return results;
};

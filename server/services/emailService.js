import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send the main email and the auto-reply
export const sendEmail = async ({ name, email, subject, message, to }) => {
  console.log("Received parameters:", { name, email, subject, message, to });
  if (!name || !email || !subject || !message || !to) {
    console.error("Missing required parameters:", {
      name,
      email,
      subject,
      message,
      to,
    });
    throw new Error("Missing required parameters");
  }
  // Email to the company
  const mailOptionsToCompany = {
    from: {
      name: name,
      address: email,
    },
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: subject,
    html: `
  <p><strong>Message from ${name}:</strong></p>
  <div>${message}</div>
`,
    text: message,
  };

  // Auto-reply to the sender
  const autoReplyOptions = {
    from: {
      name: "Ara Networks", // Company name
      address: process.env.EMAIL_USER,
    },
    to: email, // Auto-reply to the sender's email
    subject: `Re: ${subject} - Thank You for Contacting Us!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; height">
        <h2>Thank You, ${name}!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <div style="padding: 10px; background: #f9f9f9; border-left: 4px solid #0066cc;">
          ${message}
        </div>
        <p style="margin-top: 20px;">Best regards,<br>Ara Networks Team</p>
      </div>
    `,
    text: `Thank you, ${name}! We have received your message and will get back to you shortly.`,
  };

  try {
    // Send the main email
    const info = await transporter.sendMail(mailOptionsToCompany);
    console.log("Email sent to company:", info.messageId);

    // Send the auto-reply
    const autoReplyInfo = await transporter.sendMail(autoReplyOptions);
    console.log("Auto-reply sent:", autoReplyInfo.messageId);

    return {
      success: true,
      messageId: info.messageId,
      autoReplyId: autoReplyInfo.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

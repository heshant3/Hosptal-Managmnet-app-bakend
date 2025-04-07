const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Use environment variable for Gmail user
        pass: process.env.GMAIL_PASS, // Use environment variable for Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, message: error.message };
  }
};

const sendReminderEmail = async ({
  to,
  patient_name,
  doc_name,
  hospital_name,
  available_day,
  nextYourTime,
}) => {
  try {
    const subject = "Appointment Reminder";
    const text = `Dear ${patient_name},\n\nThis is a reminder for your upcoming appointment.\n\nDetails:\nDoctor: ${doc_name}\nHospital: ${hospital_name}\nDate: ${available_day}\nTime: ${nextYourTime}\n\nThank you.`;
    const html = `
      <p>Dear ${patient_name},</p>
      <p>This is a reminder for your upcoming appointment.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Doctor: ${doc_name}</li>
        <li>Hospital: ${hospital_name}</li>
        <li>Date: ${available_day}</li>
        <li>Time: ${nextYourTime}</li>
      </ul>
      <p>Thank you.</p>
    `;

    await sendEmail({ to, subject, text, html });
    console.log("Reminder email sent successfully.");
  } catch (error) {
    console.error("Error sending reminder email: ", error);
  }
};

module.exports = { sendEmail, sendReminderEmail };

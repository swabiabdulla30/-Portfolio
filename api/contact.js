const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, service, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !service || !message) {
        return res.status(400).json({ message: 'Please fill out all fields.' });
    }

    try {
        // 1. Create a transporter object using standard SMTP transport
        // You will need to add EMAIL_USER and EMAIL_PASS to your Vercel Environment Variables
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 2. Set up email data
        const mailOptions = {
            from: `"${name}" <${email}>`, // sender address (visitor)
            to: process.env.EMAIL_USER || 'swabiabdulla30@gmail.com', // list of receivers (you)
            replyTo: email,
            subject: `Portfolio Contact: ${subject} (${service})`, // Subject line
            text: `
You have received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Service Requested: ${service}
Subject: ${subject}

Message:
${message}
      `, // plain text body
            html: `
        <h3>New message from your portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Requested:</strong> <span style="color: #3b82f6; font-weight: bold;">${service}</span></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `, // html body
        };

        // 3. Send email
        await transporter.sendMail(mailOptions);

        // 4. Return success response
        return res.status(200).json({ message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            message: 'Failed to send email. Please try again later or email me directly at swabiabdulla30@gmail.com'
        });
    }
}

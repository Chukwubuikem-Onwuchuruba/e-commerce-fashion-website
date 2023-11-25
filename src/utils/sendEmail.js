import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "5e4638cf7541ef",
        pass: "17aec2d1f199f7", // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(process.cwd(), 'src', 'utils', template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: "nimi2004div@gmail.com",
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    const info = await transporter.sendMail(options());

    // Log success information or handle it accordingly
    console.log("Email sent:", info);

    // Return a success response or handle it accordingly
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    // Log the error or handle it accordingly
    console.error("Error sending email:", error);

    // Return an error response or handle it accordingly
    return { success: false, message: "Failed to send email." };
  }
};

export default sendEmail;
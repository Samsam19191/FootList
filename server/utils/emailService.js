const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { text } = require("express");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendConfirmationEmail(participant, event, wasInWaitlist) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "joininhr@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const cancelLink = `http://localhost:3000/api/events/${event._id}/${participant._id}/cancel`;
    const mailOptions = {
      from: "JoinIn <joininhr@gmail.com>",
      to: participant.email,
      subject: `Event Confirmation - ${event.title}`,
      text: wasInWaitlist
        ? `Someone dropped out of the event: ${event.title} \n Date: ${new Date(
            event.date
          ).toLocaleDateString()} \n Location: ${
            event.location
          } \n Since you were first in the waitlist, you are now participating in this event. 
          \n If you wish to cancel, click the link below: \n ${cancelLink}`
        : `Thank you for joining the event: ${event.title} \n Date: ${new Date(
            event.date
          ).toLocaleDateString()} \n Location: ${
            event.location
          } \n If you wish to cancel, click the link below: \n ${cancelLink}`,
      html: wasInWaitlist
        ? `
      <h3>Someone dropped out of the event: ${event.title}</h3>
      <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
      <p>Location: ${event.location}</p>
      <p>Since you were first in the waitlist, you are now participating in this event.</p>
      <p>If you wish to cancel, click the link below:</p>
      <a href="${cancelLink}">Cancel you participation</a>
    `
        : `
      <h3>Thank you for joining the event: ${event.title}</h3>
      <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
      <p>Location: ${event.location}</p>
      <p>If you wish to cancel, click the link below:</p>
      <a href="${cancelLink}">Cancel you participation</a>
    `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to " + participant.email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendConfirmationEmail };

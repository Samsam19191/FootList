# JoinIn

JoinIn is a simple event management web application that allows users to create events, manage participants, and join waitlists. Built with a focus on ease of use, JoinIn offers users a straightforward way to create and join events, check availability, and get notified when moved from the waitlist.

## Features

- **Event Creation**: Users can create events with details like title, date, time, location, and maximum number of participants.
- **Join Events**: Allows users to join an event if spots are available. When events are full, users have the option to join the waitlist.
- **Automatic Waitlist Management**: When a participant cancels, the first person on the waitlist is moved up and notified via email.
- **Cancel Participation**: Participants can cancel their registration, freeing up spots for waitlisted users.
- **Dynamic UI Updates**: Event details and participant status are dynamically updated for a smooth user experience.

## Technologies Used

- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Email Notifications**: Nodemailer (with Gmail API)

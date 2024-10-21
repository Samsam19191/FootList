// Toggle the display of the event creation form
function toggleEventForm() {
  const eventForm = document.getElementById("eventForm");
  eventForm.style.display =
    eventForm.style.display === "none" ? "block" : "none";
}

// function toggleEventForm() {
//   const eventForm = document.getElementById("eventForm");
//   if (eventForm.style.display === "none") {
//     eventForm.style.display = "block";
//     // Trigger reflow to enable the animation
//     void eventForm.offsetWidth; // This line forces a reflow
//     eventForm.classList.add("fade-in");
//   } else {
//     eventForm.classList.remove("fade-in");
//     eventForm.style.opacity = 0; // Set opacity to 0 for closing animation
//     setTimeout(() => {
//       eventForm.style.display = "none"; // Hide after animation
//       eventForm.style.opacity = 1; // Reset opacity for next opening
//     }, 300); // Adjust this duration to match your CSS transition duration
//   }
// }

// Form submit event for creating a new event
document
  .getElementById("eventCreationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const nbParticipants = document.getElementById("nbParticipants").value;
    const location = document.getElementById("location").value;

    const eventData = { title, date, time, nbParticipants, location };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        console.log("Event created:", newEvent);
        alert("Event created successfully!");
        document.getElementById("eventForm").style.display = "none";
        loadEvents(); // Reload events after creation
      } else {
        console.error("Error creating event:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Load and display events
async function loadEvents() {
  try {
    const response = await fetch("/api/events");
    if (response.ok) {
      const events = await response.json();
      const eventsListDiv = document.getElementById("events-list");
      eventsListDiv.innerHTML = ""; // Clear the list

      events.forEach((event) => {
        const eventDiv = document.createElement("li");
        const isEventFull = event.participants.length >= event.nbParticipants;

        eventDiv.innerHTML = `
          <h3>${event.title}</h3>
          <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
          <p>Time: ${event.time}</p>
            <p>Participants: ${event.participants.length}/${
          event.nbParticipants
        }</p>
        <p>Waitlist: ${event.waitlist.length}</p>
          <p>Location: ${event.location}</p>
          <button class="btn btn-primary mb-3" ${
            isEventFull ? "disabled" : ""
          } onclick="toggleJoinEventForm('${event._id}')">${
          isEventFull ? "Event is Full" : "Join Event"
        }</button>
        ${
          isEventFull
            ? `<button class="btn btn-primary mb-3" onclick="toggleJoinWaitlistForm('${event._id}')">Join Waitlist</button>`
            : ""
        }
        `;
        eventsListDiv.appendChild(eventDiv);
      });
    } else {
      console.error("Error fetching events:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// toggle join event form
function toggleJoinEventForm(eventId) {
  selectedEventId = eventId;
  joinEventForm = document.getElementById("joinEventForm");
  joinEventForm.style.display =
    joinEventForm.style.display === "none" ? "block" : "none";
}

// toggle join waitlist form
function toggleJoinWaitlistForm(eventId) {
  selectedEventId = eventId;
  joinWaitlistForm = document.getElementById("joinWaitlistForm");
  joinWaitlistForm.style.display =
    joinWaitlistForm.style.display === "none" ? "block" : "none";
}

// Submit the join event form
function submitJoinEvent() {
  const name = document.getElementById("nameJoin").value;
  const email = document.getElementById("emailJoin").value;

  if (name && email) {
    fetch(`/api/events/${selectedEventId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
      })
      .then((data) => {
        alert("You have joined the event!");
        document.getElementById("joinEventForm").style.display = "none";
        loadEvents(); // Reload events to reflect participants
      })
      .catch((error) => {
        alert("Error joining event: " + error.message);
      });
  } else {
    alert("Please fill in all fields.");
  }
}

// Submit the join waitlist form
function submitJoinWaitlist() {
  const name = document.getElementById("nameWait").value;
  const email = document.getElementById("emailWait").value;

  if (name && email) {
    fetch(`/api/events/${selectedEventId}/joinWaitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
      })
      .then((data) => {
        alert("You have joined the waitlist!");
        document.getElementById("joinWaitlistForm").style.display = "none";
        loadEvents(); // Reload events to reflect participants
      })
      .catch((error) => {
        alert("Error joining event: " + error.message);
      });
  } else {
    alert("Please fill in all fields.");
  }
}

// Load events when the window is loaded
window.onload = loadEvents;

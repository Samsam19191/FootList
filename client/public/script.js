// Event creation form toggle
document.getElementById("createEventButton").addEventListener("click", () => {
  document.getElementById("eventForm").style.display = "block";
});

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
          <p>Location: ${event.location}</p>
          <button ${
            isEventFull ? "disabled" : ""
          } onclick="showJoinEventForm('${event._id}')">${
          isEventFull ? "Event is Full" : "Join Event"
        }</button>
        ${
          isEventFull
            ? `<button onclick="showJoinWaitlistForm('${event._id}')">Join Waitlist</button>`
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

// Show join event form
function showJoinEventForm(eventId) {
  selectedEventId = eventId;
  document.getElementById("joinEventForm").style.display = "block";
}

// Show join waitlist form
function showJoinWaitlistForm(eventId) {
  selectedEventId = eventId;
  document.getElementById("joinEventForm").style.display = "block";
}

// Submit the join event form
function submitJoinEvent() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

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

// Load events when the window is loaded
window.onload = loadEvents;

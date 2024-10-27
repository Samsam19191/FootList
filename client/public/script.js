// Toggle the display of the event creation form
function toggleEventForm() {
  const eventForm = document.getElementById("eventForm");
  eventForm.style.display =
    eventForm.style.display === "none" ? "block" : "none";
}

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
  <p>Location: ${event.location}</p>
  
  <!-- Toggle participants button -->
  <p>
    Participants: ${event.participants.length}/${event.nbParticipants}
    <button style="display: ${
      event.participants.length === 0 ? "none" : "block"
    };" class="btn btn-link p-0" onclick="toggleParticipantsList('${
          event._id
        }')">
      (Show/Hide)
    </button>
  </p>
  
  <!-- Hidden participants list -->
  <ul id="participants-list-${event._id}" style="display: none;">
    ${event.participants
      .map((participant) => `<li>${participant.name}</li>`)
      .join("")}
  </ul>

  <p>Waitlist: ${event.waitlist.length}
  <button style="display: ${
    event.waitlist.length === 0 ? "none" : "block"
  };" class="btn btn-link p-0" onclick="toggleWaitlist('${event._id}')">
      (Show/Hide)
    </button></p>

    <!-- Hidden waitlist -->
  <ul id="waitlist-${event._id}" style="display: none;">
    ${event.waitlist
      .map((participant) => `<li>${participant.name}</li>`)
      .join("")}
  </ul>
  
  <!-- Join event button -->
  <button class="btn btn-primary mb-3" ${
    isEventFull ? "disabled" : ""
  } onclick="toggleJoinEventForm('${event._id}')">${
          isEventFull ? "Event is Full" : "Join Event"
        }</button>
  
  <!-- Join waitlist button -->
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

// Toggle the display of the participants list
function toggleParticipantsList(eventId) {
  const participantsList = document.getElementById(
    `participants-list-${eventId}`
  );
  participantsList.style.display =
    participantsList.style.display === "none" ? "block" : "none";
}

// Toggle the display of the waitlist
function toggleWaitlist(eventId) {
  const waitlist = document.getElementById(`waitlist-${eventId}`);
  waitlist.style.display = waitlist.style.display === "none" ? "block" : "none";
}

// toggle join event form modal
function toggleJoinEventForm(eventId) {
  selectedEventId = eventId;
  const modal = document.getElementById("joinEventModal");
  if (modal.classList.contains("show")) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Match the transition duration
  } else {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10); // Slight delay to trigger the transition
  }
}

// toggle join waitlist form modal
function toggleJoinWaitlistForm(eventId) {
  selectedEventId = eventId;
  const modal = document.getElementById("joinWaitlistModal");
  if (modal.classList.contains("show")) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Match the transition duration
  } else {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10); // Slight delay to trigger the transition
  }
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function (event) {
  if (document.getElementById("joinWaitlistModal").style.display === "block") {
    const modal = document.getElementById("joinWaitlistModal");
    if (event.target === modal) {
      toggleJoinWaitlistForm();
    }
  } else {
    const modal = document.getElementById("joinEventModal");
    if (event.target === modal) {
      toggleJoinEventForm();
    }
  }
};

// Submit the join event form
function submitJoinEvent() {
  const name = document.getElementById("nameJoin").value;
  const email = document.getElementById("emailJoin").value;
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

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
        document.getElementById("joinEventModal").style.display = "none";
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
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

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
        document.getElementById("joinWaitlistModal").style.display = "none";
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

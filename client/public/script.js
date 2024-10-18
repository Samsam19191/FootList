document.getElementById('createEventButton').addEventListener('click', () => {
    document.getElementById('eventForm').style.display = 'block';
});

document.getElementById('eventForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;

    const eventData = { title, date, time, location };

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (response.ok) {
            const newEvent = await response.json();
            console.log('Event created:', newEvent);
        } else {
            console.error('Error creating event:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to fetch and display events
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        if (response.ok) {
            const events = await response.json();
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = ''; // Clear existing events

            events.forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${event.title} - ${event.date} at ${event.time} (${event.location})`;
                eventsList.appendChild(li);
            });
        } else {
            console.error('Error fetching events:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to render events list
function renderEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = ''; // Clear the list

    events.forEach(event => {
        const li = document.createElement('li');
        li.textContent = `${event.title} - ${event.date} ${event.time} at ${event.location}`;
        eventsList.appendChild(li);
    });
}

window.onload = loadEvents;
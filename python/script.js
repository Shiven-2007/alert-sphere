    const contact = [
        { id: 1, title: "National Disaster Management Authority", contnum: "011-26701700" },
        { id: 2, title: "Help Line Number", contnum: "011-1078" },
    ];

    const contactList = document.getElementById('contact-list');
    contact.forEach(contact => {
        const listItem = document.createElement('li');
        listItem.textContent = `${contact.title} - ${contact.contnum}`;
        contactList.appendChild(listItem);
    });

// Simulate loading alerts
document.addEventListener('DOMContentLoaded', () => {
    const alerts = [
        { id: 1, title: "Earthquake in Turkey", date: "2024-08-21" },
        { id: 2, title: "Flood in Bangladesh", date: "2024-08-20" },
        { id: 3, title: "Wildfire in Australia", date: "2024-08-19" }
    ];

    const disasterLocations = [
        { lat: 39.9334, lng: 32.8597, title: "Earthquake in Turkey" },
        { lat: 23.6850, lng: 90.3563, title: "Flood in Bangladesh" },
        { lat: -33.8688, lng: 151.2093, title: "Wildfire in Australia" }
    ];

    const alertList = document.getElementById('alert-list');
    const map = L.map('map').setView([20.0, 0.0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers to the map
    disasterLocations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map)
            .bindPopup(`<b>${location.title}</b>`);

        // Add click event to zoom and center on marker
        marker.on('click', () => {
            map.flyTo([location.lat, location.lng], 6); // Smooth zoom to level 6
        });
    });

    // Load alerts into the list and add click event listener
    alerts.forEach(alert => {
        const listItem = document.createElement('li');
        listItem.textContent = `${alert.title} - ${alert.date}`;
        alertList.appendChild(listItem);

        // Add click event to zoom to location and scroll to the map
        listItem.addEventListener('click', () => {
            const location = disasterLocations.find(loc => loc.title === alert.title);
            if (location) {
                map.flyTo([location.lat, location.lng], 6); // Zoom level 7 for alert click

                // Scroll to the map section
                document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Location for "${alert.title}" not found on the map.`);
            }
        });
    });
});

// Handle search button click
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    alert(`Searching for: ${query}`);
});

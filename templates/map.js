const map = L.map('map').setView([39, 35], 6);

// Harita
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// İkonlar
const redIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32]
});

const yellowIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    iconSize: [32, 32]
});

let markers = [];

// Türkiye sınırları (yaklaşık)
function isTurkey(lat, lng) {
    return lat >= 36 && lat <= 42 && lng >= 26 && lng <= 45;
}

// Listeyi ve haritayı doldur
function renderEarthquakes(filter) {
    // eski markerları temizle
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const list = document.getElementById("earthquakeList");
    list.innerHTML = "";

    let filtered = earthquakes;

    if (filter === "turkey") {
        filtered = earthquakes.filter(eq => isTurkey(eq.lat, eq.lng));
        map.setView([39, 35], 6);
    } else {
        map.setView([20, 0], 2);
    }

    filtered.forEach(eq => {
        // Liste
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="mag ${eq.mag >= 5 ? "big" : ""}">${eq.mag}</span>
            <strong>${eq.title}</strong><br>
            <small>${eq.date}</small>
        `;
        list.appendChild(li);

        // Harita
        const icon = eq.mag >= 5 ? redIcon : yellowIcon;
        const marker = L.marker([eq.lat, eq.lng], { icon })
            .addTo(map)
            .bindPopup(
                `<strong>${eq.title}</strong><br>
                 Tarih: ${eq.date}<br>
                 Büyüklük: ${eq.mag}`
            );

        markers.push(marker);
    });
}

// Sekme butonları
document.getElementById("btnTurkey").onclick = () => {
    setActive("btnTurkey");
    renderEarthquakes("turkey");
};

document.getElementById("btnWorld").onclick = () => {
    setActive("btnWorld");
    renderEarthquakes("world");
};

function setActive(id) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// Sayfa açılınca: TÜM DEPREMLER
renderEarthquakes("world");

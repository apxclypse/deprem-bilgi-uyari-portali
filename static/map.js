// Türkiye sınırları (yaklaşık)
const TURKEY_BOUNDS = {
    latMin: 35,
    latMax: 43,
    lngMin: 25,
    lngMax: 45
};

// Deprem verisi Flask'tan geliyor
console.log("Deprem verisi:", earthquakes);

// Harita
const map = L.map('map').setView([39, 35], 6);

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

// Haritayı temizle
function clearMap() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

// Türkiye kontrolü
function isTurkey(eq) {
    return (
        eq.lat >= TURKEY_BOUNDS.latMin &&
        eq.lat <= TURKEY_BOUNDS.latMax &&
        eq.lng >= TURKEY_BOUNDS.lngMin &&
        eq.lng <= TURKEY_BOUNDS.lngMax
    );
}

// Liste + harita çiz
function renderEarthquakes(filter) {
    clearMap();
    const list = document.getElementById("earthquakeList");
    list.innerHTML = "";

    earthquakes
        .filter(eq => filter === "global" || isTurkey(eq))
        .forEach(eq => {
            const icon = eq.mag >= 5 ? redIcon : yellowIcon;

            // Marker
            const marker = L.marker([eq.lat, eq.lng], { icon })
                .addTo(map)
                .bindPopup(
                    `<strong>${eq.title}</strong><br>
                     Tarih: ${eq.date}<br>
                     Büyüklük: ${eq.mag}`
                );

            markers.push(marker);

            // Liste elemanı
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="mag ${eq.mag >= 5 ? 'big' : ''}">${eq.mag}</span>
                <strong>${eq.title}</strong><br>
                <small>${eq.date}</small>
            `;

            li.onclick = () => {
                map.setView([eq.lat, eq.lng], 7);
                marker.openPopup();
            };

            list.appendChild(li);
        });
}

// Sekme fonksiyonları
function showTurkey() {
    setActive(0);
    renderEarthquakes("turkey");
}

function showGlobal() {
    setActive(1);
    renderEarthquakes("global");
}

// Sekme aktifliği
function setActive(index) {
    document.querySelectorAll(".tab-btn").forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
    });
}

// Sayfa açılınca Türkiye göster
showTurkey();

// Depremleri haritaya ekle
earthquakes.forEach(eq => {
    const icon = eq.mag >= 5 ? redIcon : yellowIcon;

    L.marker([eq.lat, eq.lng], { icon })
        .addTo(map)
        .bindPopup(
            `<strong>${eq.title}</strong><br>
             Tarih: ${eq.date}<br>
             Büyüklük: ${eq.mag}`
        );
});

// Popup kapatma
function closePopup() {
    document.getElementById("alertPopup").style.display = "none";
}

// Büyük deprem kontrolü
let bigEarthquake = earthquakes.find(eq => eq.mag >= 5);

if (bigEarthquake) {
    document.getElementById("alertText").innerHTML =
        `<strong>${bigEarthquake.title}</strong><br>
         Tarih: ${bigEarthquake.date}<br>
         Büyüklük: ${bigEarthquake.mag}`;

    document.getElementById("alertPopup").style.display = "block";
}

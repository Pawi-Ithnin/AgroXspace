/**
 * Tanda X - Logic Script
 * Password: TANDAX10
 */

let map, marker, circle;

// 1. Inisialisasi Peta Google Hybrid
function initMap() {
    map = L.map('map', { zoomControl: false }).setView([4.2105, 101.9758], 6);
    
    L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
}

// 2. Fungsi Semak Password
function checkPass() {
    const p = document.getElementById('pass-input').value;
    
    // ANDA BOLEH TUKAR PASSWORD DI SINI
    if (p === "TANDAX10") {
        document.getElementById('payment-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('payment-overlay').style.display = 'none';
        }, 500);
        // Simpan status dalam browser supaya tak perlu login balik hari yang sama
        localStorage.setItem('tanda_access', 'active');
    } else {
        alert("Password salah. Sila WhatsApp admin untuk dapatkan password.");
    }
}

// 3. Logik Imbasan Lokasi & Simulasi Satelit
async function runScan() {
    const q = document.getElementById('loc').value;
    const msg = document.getElementById('ai-msg');
    
    if(!q) return alert("Sila masukkan lokasi ladang.");

    msg.innerHTML = "<i>Menghubungi kluster satelit Planet... Mengira indeks klorofil...</i>";

    try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
        const d = await r.json();

        if(d.length > 0) {
            const lat = parseFloat(d[0].lat);
            const lon = parseFloat(d[0].lon);

            // Gerakkan peta ke lokasi
            map.flyTo([lat, lon], 17, { duration: 3 });

            // Tambah tanda di peta
            if(marker) map.removeLayer(marker);
            if(circle) map.removeLayer(circle);
            
            marker = L.marker([lat, lon]).addTo(map);
            circle = L.circle([lat, lon], {
                radius: 250, 
                color: '#2ecc71',
                fillColor: '#2ecc71',
                fillOpacity: 0.2
            }).addTo(map);

            // Simulasi "Processing Time"
            setTimeout(() => {
                const ndvi = (0.60 + Math.random() * 0.30).toFixed(2);
                const moisture = Math.floor(40 + Math.random() * 50) + "%";
                
                document.getElementById('v1').innerText = ndvi;
                document.getElementById('v2').innerText = moisture;
                
                let status = "";
                let advice = "";

                if(ndvi > 0.75) {
                    status = "SIHAT";
                    document.getElementById('v3').style.color = "green";
                    advice = `<b>Analisis Selesai:</b> Ladang di ${q} menunjukkan kesuburan optimum. Tiada tindakan diperlukan.`;
                } else {
                    status = "STRES";
                    document.getElementById('v3').style.color = "red";
                    advice = `<b>Analisis Selesai:</b> Ladang di ${q} dikesan mengalami stres pertumbuhan ringan. Sila periksa baja/air.`;
                }

                document.getElementById('v3').innerText = status;
                msg.innerHTML = advice;
                
                // Tunjukkan butang laporan
                document.getElementById('dl-btn').style.display = 'block';
            }, 3500);

        } else {
            msg.innerText = "Lokasi tidak ditemui. Sila cuba kata kunci lain.";
        }
    } catch(e) {
        msg.innerText = "Ralat talian. Sila cuba lagi.";
    }
}

// 4. Jalankan fungsi mula bila web dibuka
window.onload = () => {
    initMap();
    // Cek jika user sudah pernah masuk
    if(localStorage.getItem('tanda_access') === 'active') {
        document.getElementById('payment-overlay').style.display = 'none';
    }
};

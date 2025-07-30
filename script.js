// Global variables
let currentSection = 0;
const originalSectionContents = [];
let typeWriterInterval, countdownInterval, timeInterval, dataStreamInterval, focusTimerInterval;
let journalEntries = [];
let currentLogId = null;

const quotes = ["Kalau umur 20-anmu dipakai cuma buat cari kenyamanan, siap-siap umur 30-anmu dipakai buat nyesal dalam diam.", "Mentalitas 5% itu kamu dicaci karena beda, bukan dipuji karena ikut-ikutan.", "Mereka yang ngeremehinnmu hari ini? Adalah yang akan pinjam uang darimu 5 tahun lagi.", "Sukses dibangun dari perjuangan sunyi, bukan sorakan ramai.", "AI tidak akan menggantikanmu. Tapi manusia yang paham AI yang akan menggantikan mu.", "Setiap seribu perak yang kau masukkan ke Bitcoin hari ini adalah tamparan keras ke wajah sistem yang ingin kau tetap miskin.", "Jangan ikut jalan ini kalau kamu masih butuh persetujuan orang. Ini jalan sepi. Jalan berdarah. Tapi hasilnya… menggetarkan hidup mu didunia."];

// --- UTILITY FUNCTIONS ---
function playSound(audioId) { const e = document.getElementById(audioId); if (e) { e.currentTime = 0; e.play().catch(err => {}); } }
function playBgMusic() { const e = document.getElementById("bg-music"); if (e) { e.play().catch(err => { document.body.addEventListener("click", () => e.play(), { once: true }); }); } }

// ... Salin semua sisa kode JavaScript Anda dari tag <script> lama ke sini ...
// Pastikan semua kode JavaScript dari atas sampai akhir ada di sini
window.onload = function () {
    runBootSequence();
};
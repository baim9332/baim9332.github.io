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

// --- CORE FEATURE FUNCTIONS ---
function generateQuote() { playSound('click-sound'); const e = document.getElementById("quoteDisplay"); const t = Math.floor(Math.random() * quotes.length); const randomQuote = quotes[t]; if(e) e.textContent = `"${randomQuote}"`; return randomQuote; }
function calculateDCA() { playSound('click-sound'); const e = parseFloat(document.getElementById("dcaAmount").value), t = document.getElementById("dcaFrequency").value, n = document.getElementById("dcaResult"); if (isNaN(e) || e <= 0) { n.textContent = "Masukkan nominal yang valid."; return; } const o = (new Date).getFullYear(), a = 2030; let i = (a - o) * 12 + (12 - (new Date).getMonth()); let l = 0; l = "weekly" === t ? e * Math.floor(i * 4.345) : e * i; n.innerHTML = `Total modal terkumpul hingga akhir 2030: Rp ${l.toLocaleString("id-ID")}.<br>\n        <span style="color: #00ffff; font-size: 14px;">Dengan asumsi pertumbuhan pasar, nilainya berpotensi menjadi jauh lebih besar. Inilah kekuatan konsistensi.</span>`; }
function typeWriter(e, t, n = 25) { let o = 0; if (e && t) { e.innerHTML = ""; typeWriterInterval && clearInterval(typeWriterInterval); typeWriterInterval = setInterval(() => { o < t.length ? (e.innerHTML += t.charAt(o), o++) : clearInterval(typeWriterInterval); }, n); } }
function countdown2030() { clearInterval(countdownInterval); const e = new Date("December 31, 2030 23:59:59").getTime(), t = document.getElementById("countdown"); if (t) { t.innerHTML = "Memuat hitung mundur..."; const n = () => { const n = (new Date).getTime(), o = e - n, a = Math.floor(o / 864e5); document.getElementById("countdown") && (document.getElementById("countdown").innerHTML = "Sisa hari menuju 2030: " + a + " hari"); }; n(); countdownInterval = setInterval(n, 1e3); } }
function showIndoTime() { clearInterval(timeInterval); const e = document.getElementById("indoTime"); if (e) { e.innerHTML = "Memuat waktu..."; const t = () => { const t = (new Date).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" }); document.getElementById("indoTime") && (document.getElementById("indoTime").innerHTML = "Waktu Indonesia: " + t); }; t(); timeInterval = setInterval(t, 1e3); } }
function updateNavProgressBar(e, t) { document.querySelector(".progress-bar").style.width = (e / (t - 1)) * 100 + "%"; }
function sharePage() { playSound('click-sound'); navigator.share ? navigator.share({ title: document.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href).then(() => { alert("URL halaman telah disalin ke clipboard!"); }, () => { alert("Fitur share tidak didukung. Silakan salin URL secara manual."); }); }
function toggleTheme() { playSound('click-sound'); document.body.classList.toggle("light-mode"); }
function resetSectionContents() { document.querySelectorAll(".section").forEach((e, t) => { if (originalSectionContents[t]) { e.innerHTML = originalSectionContents[t]; } }); }
function searchContent() { const e = document.getElementById("searchInput").value.toLowerCase().trim(); const t = document.querySelectorAll(".section"); const n = document.getElementById("searchResults"), o = document.getElementById("searchResultsList"); o.innerHTML = ""; resetSectionContents(); n.style.display = "none"; if (e.length === 0) { showSection(currentSection); return; } let a = []; t.forEach((t, n) => { if (n === 0) return; const o = document.createElement("div"); o.innerHTML = originalSectionContents[n]; const i = o.textContent.toLowerCase(), l = o.querySelector("h2") ? o.querySelector("h2").textContent : `Bab ${n}`; if (i.includes(e)) { a.push({ index: n, title: l, term: e }); } }); if (a.length > 0) { n.style.display = "block"; document.querySelectorAll(".section").forEach(e => e.classList.remove("active")); a.forEach(e => { const a = document.createElement("li"); a.textContent = e.title; a.style.cursor = "pointer"; a.onclick = () => { showSection(e.index, e.term); n.style.display = "none"; }; o.appendChild(a); }); } else { o.innerHTML = "<li>Tidak ditemukan konten yang cocok.</li>"; n.style.display = "block"; } }
function highlightText(sectionElement, term) { if (!term || !sectionElement) return; let innerHTML = sectionElement.innerHTML; const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, 'gi'); innerHTML = innerHTML.replace(regex, '<span class="highlight" style="background-color: var(--glow-gold); color: var(--dark-bg);">$1</span>'); sectionElement.innerHTML = innerHTML; }
async function fetchBitcoinPrice() { const e = document.getElementById("crypto-ticker"); if (!e) return null; try { const t = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr&include_24hr_change=true"), n = await t.json(), o = n.bitcoin, a = o.idr, i = o.idr_24h_change; const l = `Rp ${a.toLocaleString("id-ID")}`, d = `${i.toFixed(2)}%`, s = i >= 0 ? "change-positive" : "change-negative", c = i >= 0 ? "▲" : "▼"; e.innerHTML = `<span><strong>Bitcoin (BTC)</strong></span> <span class="price">${l}</span> <span class="${s}">${c} ${d} (24j)</span>`; return { price: l, change: d, isPositive: i >= 0 }; } catch (t) { e.textContent = "Gagal memuat data harga Bitcoin."; console.error("Error fetching Bitcoin price:", t); return null; } }

// --- LOGBOOK FUNCTIONS ---
function initLogbook() {
    const storedEntries = localStorage.getItem('journalEntries');
    journalEntries = storedEntries ? JSON.parse(storedEntries) : [];
    renderLogList();
    showEditorPlaceholder();
    document.getElementById('new-log-btn').onclick = createNewLogEntry;
    document.getElementById('save-log-btn').onclick = saveLogEntry;
    document.getElementById('delete-log-btn').onclick = deleteLogEntry;
}
function renderLogList() { const listEl = document.getElementById('logbook-list-entries'); listEl.innerHTML = ''; if (journalEntries.length === 0) { listEl.innerHTML = '<p style="opacity:0.5; text-align:center;">Belum ada entri jurnal.</p>'; return; } const sortedEntries = [...journalEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); sortedEntries.forEach(entry => { const entryEl = document.createElement('div'); entryEl.className = 'log-entry'; entryEl.dataset.id = entry.id; if (entry.id === currentLogId) { entryEl.classList.add('selected'); } entryEl.innerHTML = `<h5>${entry.title || 'Tanpa Judul'}</h5><small>${new Date(entry.timestamp).toLocaleString('id-ID')}</small>`; entryEl.onclick = () => selectLogEntry(entry.id); listEl.appendChild(entryEl); }); }
function showEditorPlaceholder() { document.getElementById('logbook-editor-area').style.display = 'none'; document.getElementById('editor-placeholder').style.display = 'block'; }
function showEditor() { document.getElementById('logbook-editor-area').style.display = 'flex'; document.getElementById('editor-placeholder').style.display = 'none'; }
function createNewLogEntry() { playSound('click-sound'); currentLogId = null; document.getElementById('log-title').value = ''; document.getElementById('log-content').value = ''; document.getElementById('delete-log-btn').style.display = 'none'; document.querySelectorAll('.log-entry').forEach(el => el.classList.remove('selected')); showEditor(); document.getElementById('log-title').focus(); }
function selectLogEntry(id) { playSound('click-sound'); const entry = journalEntries.find(e => e.id === id); if (entry) { currentLogId = id; document.getElementById('log-title').value = entry.title; document.getElementById('log-content').value = entry.content; document.getElementById('delete-log-btn').style.display = 'inline-block'; renderLogList(); showEditor(); } }
function saveLogEntry() { playSound('click-sound'); const title = document.getElementById('log-title').value; const content = document.getElementById('log-content').value; if (content.trim() === '') { alert('Isi jurnal tidak boleh kosong.'); return; } if (currentLogId) { const index = journalEntries.findIndex(e => e.id === currentLogId); if (index > -1) { journalEntries[index].title = title; journalEntries[index].content = content; journalEntries[index].timestamp = new Date().toISOString(); } } else { const newEntry = { id: `log_${Date.now()}`, title: title, content: content, timestamp: new Date().toISOString() }; journalEntries.push(newEntry); currentLogId = newEntry.id; } localStorage.setItem('journalEntries', JSON.stringify(journalEntries)); renderLogList(); alert('Entri jurnal berhasil disimpan!'); }
function deleteLogEntry() { if (!currentLogId) return; if (confirm('Apakah Anda yakin ingin menghapus entri ini secara permanen?')) { playSound('click-sound'); journalEntries = journalEntries.filter(e => e.id !== currentLogId); localStorage.setItem('journalEntries', JSON.stringify(journalEntries)); currentLogId = null; renderLogList(); createNewLogEntry(); showEditorPlaceholder(); alert('Entri telah dihapus.'); } }

// --- SYSTEM UTILITIES FUNCTIONS ---
function initUtilities() {
    document.getElementById('export-btn').onclick = exportAllData;
    document.getElementById('import-btn').onclick = () => document.getElementById('import-file-input').click();
    document.getElementById('import-file-input').onchange = importAllData;
}
function exportAllData() { playSound('click-sound'); const backupData = { journalEntries: JSON.parse(localStorage.getItem('journalEntries') || '[]'), graffitiMessages: JSON.parse(localStorage.getItem('graffitiMessages') || '[]'), missions: {}, habits: {} }; missionTasks.forEach(task => { backupData.missions[task.id] = localStorage.getItem('mission_' + task.id) === 'true'; }); for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key.startsWith('habit_')) { backupData.habits[key] = localStorage.getItem(key); } } const dataStr = JSON.stringify(backupData, null, 2); const dataBlob = new Blob([dataStr], {type: "application/json"}); const url = URL.createObjectURL(dataBlob); const a = document.createElement('a'); a.href = url; const date = new Date().toISOString().split('T')[0]; a.download = `jurnal_futuristik_backup_${date}.json`; a.click(); URL.revokeObjectURL(url); alert('Data berhasil diekspor!'); }
function importAllData(event) { playSound('click-sound'); const file = event.target.files[0]; if (!file) return; if (!confirm("Mengimpor data akan menimpa semua data yang ada saat ini. Lanjutkan?")) { return; } const reader = new FileReader(); reader.onload = function(e) { try { const data = JSON.parse(e.target.result); if (data.journalEntries) localStorage.setItem('journalEntries', JSON.stringify(data.journalEntries)); if (data.graffitiMessages) localStorage.setItem('graffitiMessages', JSON.stringify(data.graffitiMessages)); if (data.missions) Object.keys(data.missions).forEach(taskId => localStorage.setItem('mission_' + taskId, data.missions[taskId])); if (data.habits) Object.keys(data.habits).forEach(habitKey => localStorage.setItem(habitKey, data.habits[habitKey])); alert('Data berhasil diimpor! Halaman akan dimuat ulang untuk menerapkan perubahan.'); location.reload(); } catch (error) { alert('File tidak valid atau rusak. Gagal mengimpor data.'); console.error("Import error:", error); } }; reader.readAsText(file); }

// --- OTHER INTERACTIVE MODULES ---
function setupContactForm() { const e = document.getElementById("contactForm"); e && e.addEventListener("submit", function (t) { t.preventDefault(); playSound('click-sound'); const n = document.getElementById("name").value, o = document.getElementById("subject").value, a = document.getElementById("message").value; const i = `\nHalo,\n\nAnda menerima pesan kolaborasi baru dari Jurnal Futuristik.\n\nDetail Pengirim:\nNama: ${n}\n\nIsi Pesan:\n${a}\n            `; const l = `mailto:baimm9332@gmail.com?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(i)}`; const d = document.getElementById("success-message"); d && (d.style.display = "block"); setTimeout(() => { window.location.href = l; }, 1500); setTimeout(() => { d && (d.style.display = "none"); }, 5e3); }); }
function initDataHub() { updateBtcWidget(); initDataStream(); updateDcaVisualizer(); setInterval(updateBtcWidget, 3e4); }
async function updateBtcWidget() { const e = document.getElementById("hub-btc-price"), t = document.getElementById("hub-btc-change"); if (e && t) try { const n = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr&include_24hr_change=true"), o = await n.json(), a = o.bitcoin; e.textContent = `Rp ${a.idr.toLocaleString("id-ID")}`; const i = a.idr_24h_change, l = i >= 0 ? "change-positive" : "change-negative", d = i >= 0 ? "▲" : "▼"; t.innerHTML = `<span class="${l}">${d} ${i.toFixed(2)}%</span>`; } catch (n) { e.textContent = "Error"; t.textContent = "Gagal memuat data"; } }
function initDataStream() { const e = document.getElementById("data-stream-list"); if (!e) return; const t = ["ANALYSIS: AI adoption rate exceeds initial projections by 200%.", "REPORT: Decentralized finance (DeFi) protocols reach new all-time high in total value locked.", "SYSTEM ALERT: Volatility spike detected in crypto markets. DCA protocol remains optimal.", "NEWS: Tech giants race to develop next-gen neural network architectures.", "INSIGHT: The 5% mentality proves crucial in navigating market uncertainty.", "UPDATE: New open-source AI model released, challenging proprietary systems.", "FORECAST: Long-term Bitcoin holders continue to accumulate, ignoring short-term noise.", "SIGNAL: Geopolitical tensions driving interest in non-sovereign assets."], n = [...t, ...t]; e.innerHTML = n.map(e => `<li>${e}</li>`).join(""); }
function updateDcaVisualizer() { const e = document.getElementById("dca-target"), t = document.getElementById("dca-current"), n = document.getElementById("dca-progress-fill"), o = document.getElementById("dca-progress-text"); const a = () => { const a = parseFloat(e.value) || 1e7, i = parseFloat(t.value) || 0; if (a > 0) { percent = Math.min(i / a * 100, 100); n.style.width = `${percent}%`; o.textContent = `Tercapai: ${percent.toFixed(1)}% dari target Rp ${a.toLocaleString("id-ID")}`; } }; e.addEventListener("input", a); t.addEventListener("input", a); a(); }

// --- MENTALITY ANALYZER (QUIZ) ---
function initAnalyzer() { const e = document.getElementById("analyze-btn"); e && e.addEventListener("click", calculateResult); const t = document.getElementById("share-result-btn"); t && t.addEventListener("click", shareArchetype); }
function calculateResult() { playSound('click-sound'); const e = document.getElementById("quiz-container").querySelectorAll('input[type="radio"]:checked'); if (e.length < 10) { alert("Harap jawab semua 10 pertanyaan untuk melanjutkan analisis."); return; } let t = 0; e.forEach(e => { t += parseInt(e.dataset.value); }); displayResult(t); }
function displayResult(e) { const t = document.getElementById("quiz-container"), n = document.getElementById("result-container"), o = document.getElementById("archetype-title"), a = document.getElementById("archetype-description"), i = document.getElementById("archetype-advice"); let l = {}; l = e <= 16 ? { title: "The Sleeper (Sang Penonton)", description: "Anda cenderung mengikuti arus dan mencari kenyamanan. Anda melihat perubahan dari pinggir lapangan, namun ragu untuk masuk ke dalam permainan. Potensi besar dalam diri Anda masih tertidur, menunggu percikan yang tepat untuk bangkit.", advice: "Mulai dari yang terkecil. Lawan rasa nyaman dengan satu aksi kecil hari ini. Beli Bitcoin senilai Rp 10.000, baca satu halaman buku tentang investasi, atau matikan media sosial 1 jam lebih awal. Percikan apimu ada di dalam tindakan, bukan angan-angan." } : e <= 24 ? { title: "The Digital Nomad (Sang Pengembara Digital)", description: "Anda sadar akan perubahan dan memiliki keinginan untuk mandiri. Anda sudah mulai melangkah, namun terkadang masih terpengaruh oleh opini orang lain atau 'noise' jangka pendek. Anda berada di jalur yang benar, namun butuh fokus yang lebih tajam.", advice: "Perkuat fondasi Anda. Buat jadwal DCA yang tidak bisa ditawar lagi. Tentukan satu skill untuk Anda dalami selama 6 bulan ke depan. Kurangi 'noise' dengan membatasi sumber informasi. Jalan Anda sudah benar, sekarang saatnya berlari." } : { title: "The System Architect (Sang Arsitek Sistem)", description: "Selamat datang di mentalitas 5%. Anda berpikir dalam kerangka sistem, bukan sekadar tujuan jangka pendek. Anda tidak takut berjalan sendirian dan melihat volatilitas sebagai peluang. Anda tidak hanya mengikuti permainan; Anda sedang membangunnya.", advice: "Tantangan terbesarmu sekarang adalah konsistensi dan kesabaran. Terus bangun sistemmu dalam sunyi. Dokumentasikan perjalananmu, karena suatu hari nanti itu akan menjadi peta bagi mereka yang ingin mengikuti jejakmu. Jangan biarkan kesuksesan awal membuatmu lengah." }; o.textContent = l.title; a.textContent = l.description; i.textContent = l.advice; t.style.display = "none"; n.style.display = "block"; }
function shareArchetype() { playSound('click-sound'); const e = document.getElementById("archetype-title").textContent; const t = `Hasil Analisis Mentalitas dari Jurnal Futuristik King & Crytobot:\n\nArketipe saya adalah: ${e}.\n\nCari tahu arketipemu sendiri dan mulailah membangun masa depanmu di: ${window.location.href}`; navigator.clipboard.writeText(t).then(() => { const e = document.getElementById("share-result-btn"); e.textContent = "✔️ Tersalin!"; setTimeout(() => { e.textContent = "Bagikan Hasil Analisis"; }, 2e3); }, () => { alert("Gagal menyalin. Silakan salin secara manual."); }); }

// --- CONSOLE ---
function initConsole() { const e = document.getElementById("console-input"), t = document.getElementById("console-output"); t.innerHTML = "Crytobot OS v3.2 Initialized.\nKetik 'help' untuk daftar perintah.\n\n"; e.addEventListener("keydown", function (n) { if ("Enter" === n.key) { const n = e.value.trim(); appendOutput(`> ${n}`); handleCommand(n); e.value = ""; } }); }
function appendOutput(e) { const t = document.getElementById("console-output"); t.innerHTML += e + "\n"; t.scrollTop = t.scrollHeight; }
function handleCommand(e) { const t = e.toLowerCase().split(" "), n = t[0]; switch (n) { case "help": appendOutput("Perintah yang tersedia:\n  help          - Menampilkan bantuan.\n  bab [no]      - Ringkasan bab. Cth: bab 2\n  misi          - Tampilkan progres misi.\n  quote         - Kutipan motivasi.\n  btc           - Harga Bitcoin saat ini.\n  clear         - Bersihkan konsol.\n  ping          - Cek koneksi."); break; case "bab": const e = parseInt(t[1]); if (!isNaN(e) && e > 0 && e < 11) { showSection(e); appendOutput(`Melompat ke Bab ${e}...`); } else { appendOutput("Error: Bab tidak valid. Cth: bab 1"); } break; case "quote": generateQuote(); setTimeout(() => appendOutput("[SUKSES] Kutipan baru ditampilkan di atas."), 100); break; case "btc": appendOutput("[MEMINTA DATA] Mengambil harga Bitcoin..."); fetchBitcoinPrice().then(() => { const e = document.getElementById("crypto-ticker").innerText; appendOutput(`[DATA DITERIMA] ${e}`); }); break; case "clear": document.getElementById("console-output").innerHTML = ""; break; case "misi": const o = updateMissionProgress(); appendOutput(`Progres 'Fondasi Brutal' saat ini: ${o.toFixed(0)}%.`); break; case "ping": appendOutput("Pong! Koneksi ke Crytobot Core stabil. Latensi: 1ms."); break; default: appendOutput(`Error: Perintah '${e}' tidak ditemukan.`); break; } }

// --- GRAFFITI WALL ---
function initGraffitiWall() { const e = document.getElementById("graffiti-display"), t = JSON.parse(localStorage.getItem("graffitiMessages")) || []; e.innerHTML = ""; if (t.length === 0) { e.innerHTML = '<p style="opacity: 0.5;">Belum ada jejak digital yang ditinggalkan...</p>'; } else { t.forEach(msg => { const t = document.createElement('div'); t.className = 'graffiti-post'; t.innerHTML = `<p>"${msg.text}"</p><small>- Anonymous User, ${new Date(msg.timestamp).toLocaleString('id-ID')}</small>`; e.prepend(t); }); } document.getElementById('add-graffiti-btn').onclick = addGraffiti; }
function addGraffiti() { playSound('click-sound'); const e = document.getElementById("graffiti-input"), t = e.value.trim(); if (t === "") return; const n = JSON.parse(localStorage.getItem("graffitiMessages")) || []; n.push({ text: t, timestamp: new Date().toISOString() }); localStorage.setItem("graffitiMessages", JSON.stringify(n)); e.value = ""; initGraffitiWall(); }

// --- MISSION & HABIT TRACKERS ---
const missionTasks = [{ id: 'task1', text: 'Bangun mentalitas baja: disiplin, tidak reaktif, tidak butuh validasi.' }, { id: 'task2', text: 'Konsisten DCA Bitcoin setiap minggu/bulan (walau kecil).' }, { id: 'task3', text: 'Belajar satu skill bernilai tinggi (AI, desain, coding, dll).' }, { id: 'task4', text: 'Bangun Jurnal Hidup & dokumentasi perjalanan sukses.' }, { id: 'task5', text: 'Saring lingkaran sosial: buang toxic, rangkul yang satu frekuensi.' }, { id: 'task6', text: 'Bangun identitas digital: akun sebagai branding The Soul Giver.' }];
function updateMissionProgress() { const completedTasks = missionTasks.filter(task => localStorage.getItem('mission_' + task.id) === 'true').length; const progress = (completedTasks / missionTasks.length) * 100; const progressBar = document.getElementById('mission-progress-bar'); const progressText = document.getElementById('mission-progress-text'); if (progressBar && progressText) { progressBar.style.width = progress + '%'; progressText.textContent = `Progres Fondasi Brutal: ${completedTasks} dari ${missionTasks.length} misi (${progress.toFixed(0)}%)`; } return progress; }
function initMissionTracker() { const missionList = document.getElementById('mission-list'); if (!missionList) return; missionList.innerHTML = ''; missionTasks.forEach(task => { const isChecked = localStorage.getItem('mission_' + task.id) === 'true'; missionList.innerHTML += `<li><input type="checkbox" id="${task.id}" data-taskid="${task.id}" ${isChecked ? 'checked' : ''}><label for="${task.id}">${task.text}</label></li>`; }); missionList.addEventListener('change', (e) => { if (e.target.type === 'checkbox') { playSound('click-sound'); localStorage.setItem('mission_' + e.target.dataset.taskid, e.target.checked); updateMissionProgress(); } }); updateMissionProgress(); }
function initDailyCheck() { const today = new Date().toISOString().split('T')[0]; const lastVisit = localStorage.getItem('lastVisitDate'); if (today !== lastVisit) { const overlay = document.getElementById('daily-check-overlay'); const dailyQuoteEl = document.getElementById('daily-quote'); const dailyBtcEl = document.getElementById('daily-btc-status'); const missionProgress = updateMissionProgress(); dailyQuoteEl.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`; document.getElementById('daily-mission-status').textContent = `Kemajuan misimu saat ini ${missionProgress.toFixed(0)}%. Terus berjuang.`; fetchBitcoinPrice().then(btcData => { if (btcData) { dailyBtcEl.innerHTML = `BTC Saat Ini: ${btcData.price} | 24j: ${btcData.change}`; } else { dailyBtcEl.textContent = 'Status BTC tidak dapat dimuat.'; } }); overlay.style.display = 'flex'; localStorage.setItem('lastVisitDate', today); } }
function closeDailyCheck() { playSound('click-sound'); document.getElementById('daily-check-overlay').style.display = 'none'; }
const dailyHabits = [{id: 'dca', name: 'DCA Rutin'}, {id: 'skill', name: 'Belajar Skill'}, {id: 'read', name: 'Membaca'}, {id: 'plan', name: 'Rencana Besok'}];
function initHabitTracker() { const grid = document.getElementById('habit-grid'); if(!grid) return; grid.innerHTML = ''; const today = new Date().toISOString().split('T')[0]; dailyHabits.forEach(habit => { const isChecked = localStorage.getItem(`habit_${habit.id}_${today}`) === 'true'; const card = document.createElement('div'); card.className = `habit-card ${isChecked ? 'checked' : ''}`; card.dataset.habitId = habit.id; card.innerHTML = `<div class="habit-name">${habit.name}</div><div class="habit-check"></div>`; card.onclick = () => { const today = new Date().toISOString().split('T')[0]; const key = `habit_${habit.id}_${today}`; const isDone = localStorage.getItem(key) === 'true'; localStorage.setItem(key, !isDone); card.classList.toggle('checked'); playSound('click-sound'); }; grid.appendChild(card); }); }
function initFocusTimer() { const display = document.getElementById('timer-display'); let totalSeconds = 25 * 60; let isPaused = true; const updateDisplay = () => { const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }; const tick = () => { if (isPaused) return; totalSeconds--; updateDisplay(); if (totalSeconds <= 0) { clearInterval(focusTimerInterval); playSound('timer-sound'); alert("Sesi fokus selesai! Waktunya istirahat."); } }; window.startTimer = () => { playSound('click-sound'); if (isPaused) { isPaused = false; focusTimerInterval = setInterval(tick, 1000); } }; window.pauseTimer = () => { playSound('click-sound'); isPaused = true; clearInterval(focusTimerInterval); }; window.resetTimer = () => { playSound('click-sound'); isPaused = true; clearInterval(focusTimerInterval); totalSeconds = 25 * 60; updateDisplay(); }; updateDisplay(); }

// --- NAVIGATION & PAGE LOAD ---
function showSection(e, termToHighlight) {
    playSound('click-sound');
    const t = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll('.main-nav a');
    if (e < 0 || e >= t.length) return;
    
    typeWriterInterval && clearInterval(typeWriterInterval);
    focusTimerInterval && clearInterval(focusTimerInterval);
    
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("searchInput").value = "";
    
    resetSectionContents();
    t.forEach(sec => sec.classList.remove("active"));
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeSection = t[e];
    activeSection.classList.add("active");

    navLinks.forEach(link => {
        if (link.getAttribute('onclick') === `showSection(${e})`) {
            link.classList.add('active');
        }
    });

    if (termToHighlight) { highlightText(activeSection, termToHighlight); }
    if (window.innerWidth < 800) { 
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    updateNavProgressBar(e, t.length);
    currentSection = e;

    // Functions that need to re-run every time a section is shown
    const typeWriterSections = { 5: "crytobot-speak-up", 6: "crytobot-meeting" };
    if (typeWriterSections[e]) { const el = document.getElementById(typeWriterSections[e]); if (el) { const textToType = el.textContent; typeWriter(el, textToType, 20); } }
    if (e === 0) { countdown2030(); showIndoTime(); }
    if (e === 15) { document.getElementById('console-input')?.focus(); }
}

function nextSection() { showSection(currentSection + 1); }
function prevSection() { showSection(currentSection - 1); }

function runBootSequence() {
    const bootLogElement = document.getElementById("boot-log");
    const bootMessages = ["Booting Crytobot OS v3.2...", "Initializing kernel...", "Mounting virtual file systems... [OK]", "Loading modules:", "  > Logbook.dll... [INTEGRATED]", "  > ExecutionDeck.dll... [ONLINE]", "  > MissionTracker.dll... [LOADED]", "  > SoulGiver.dll... [SYNCHRONIZED]", "Verifying system integrity... [OK]", "Establishing secure connection...", "Welcome, King.", "Executing Daily System Check...", "Loading Jurnal Futuristik Interface..."];
    let messageIndex = 0;
    
    const bootInterval = setInterval(() => {
        if (messageIndex < bootMessages.length) {
            const listItem = document.createElement("li");
            listItem.textContent = bootMessages[messageIndex];
            bootLogElement.appendChild(listItem);
            messageIndex++;
        } else {
            clearInterval(bootInterval);
            setTimeout(() => {
                document.getElementById("boot-sequence").classList.add("hidden");
                initPage();
            }, 500); // Shortened delay
        }
    }, 120); // Faster interval
}

/**
 * Initializes all interactive modules ONCE after the page loads.
 * This is more efficient than initializing them every time a section is shown.
 */
function initInteractiveModules() {
    initLogbook();
    setupContactForm();
    initDataHub();
    initAnalyzer();
    initConsole();
    initGraffitiWall();
    initMissionTracker();
    initHabitTracker();
    initFocusTimer();
    initUtilities();
}

function initPage() { 
    document.querySelectorAll(".section").forEach((e, t) => { originalSectionContents[t] = e.innerHTML; }); 
    
    // Initialize all interactive components once
    initInteractiveModules();
    
    showSection(0); 
    fetchBitcoinPrice(); 
    setInterval(fetchBitcoinPrice, 60000); 
    playBgMusic(); 
    setTimeout(initDailyCheck, 2000); 
}

window.onload = function () {
    runBootSequence();
};

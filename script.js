// ==============================
// 1️⃣ Load Prayer Times from API
// ==============================
async function loadPrayerTimes(city = "London", country = "UK") {
  try {
    let response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
    let data = await response.json();
    let timings = data.data.timings;

    let ul = document.getElementById("prayerTimes");
    ul.innerHTML = `
      <li>Fajr: ${timings.Fajr}</li>
      <li>Dhuhr: ${timings.Dhuhr}</li>
      <li>Asr: ${timings.Asr}</li>
      <li>Maghrib: ${timings.Maghrib}</li>
      <li>Isha: ${timings.Isha}</li>
    `;
  } catch (err) {
    console.error("Error fetching prayer times:", err);
  }
}

// Call on page load
loadPrayerTimes();


// ==============================
// 2️⃣ Points, Streak, Daily Reset
// ==============================
let points = parseInt(localStorage.getItem("points")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;

// Track which prayers are done today
let todayPrayers = JSON.parse(localStorage.getItem("todayPrayers")) || {
  Fajr: false,
  Dhuhr: false,
  Asr: false,
  Maghrib: false,
  Isha: false
};

// Check last date to reset daily
let lastDate = localStorage.getItem("lastDate");
let todayDate = new Date().toLocaleDateString();

if (lastDate !== todayDate) {
  // New day → reset today's prayers
  todayPrayers = {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false
  };
  localStorage.setItem("todayPrayers", JSON.stringify(todayPrayers));
  localStorage.setItem("lastDate", todayDate);
}

// ==============================
// 3️⃣ Update UI Function
// ==============================
function updateUI() {
  document.getElementById("points").innerText = "Points: " + points;
  document.getElementById("streak").innerText = "Streak: " + streak + " 🔥";
}

// Initial UI update
updateUI();

// ==============================
// 4️⃣ Pray Function
// ==============================
function pray(prayerName) {
  if (!todayPrayers[prayerName]) {
    // Add points for this prayer
    points += 10;
    todayPrayers[prayerName] = true;

    // Save data
    localStorage.setItem("points", points);
    localStorage.setItem("todayPrayers", JSON.stringify(todayPrayers));

    updateUI();

    // Check if all prayers done → increase streak
    if (Object.values(todayPrayers).every(done => done)) {
      streak += 1;
      localStorage.setItem("streak", streak);
      alert("🎉 Congrats! You completed all prayers today! Streak increased.");
    }
  } else {
    alert(`You already prayed ${prayerName} today!`);
  }
}
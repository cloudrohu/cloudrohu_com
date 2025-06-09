let currentDate = new Date();

// Notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Live Clock
function updateClock() {
  const now = new Date();
  document.getElementById("liveClock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Generate Calendar
function generateCalendar() {
  const calendar = document.getElementById("calendar");
  const currentMonth = document.getElementById("currentMonth");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  currentMonth.textContent = `${monthName} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  // Empty cells for previous month days
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;
    cell.className = "text-center p-2 rounded cursor-pointer hover:bg-blue-200";

    if (isCurrentMonth && day === today.getDate()) {
      cell.classList.add("bg-blue-600", "text-white", "font-bold");
    }

    calendar.appendChild(cell);
  }
}

// Navigation
function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
}
function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
}

// Modal Control
function openModal() {
  document.getElementById("eventModal").classList.remove("hidden");
  document.getElementById("eventModal").classList.add("flex");
}
function closeModal() {
  document.getElementById("eventModal").classList.add("hidden");
  // Reset form and reminder options on close
  document.getElementById("eventForm").reset();
  document.getElementById("reminderOptions").classList.add("hidden");
}

// Toggle Reminder Field
function toggleReminder() {
  const box = document.getElementById("reminderOptions");
  box.classList.toggle("hidden");
}

// Handle Event Form
document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const emailsRaw = document.getElementById("emails").value;
  const reminderMins = Number(document.getElementById("reminderTime").value);

  const emailList = emailsRaw.split(",").map((email) => email.trim());

  console.log("New Event:");
  console.log("Title:", title);
  console.log("Description:", desc);
  console.log("Date:", date);
  console.log("Time:", time);
  console.log("Emails:", emailList);
  console.log("Reminder before (mins):", reminderMins);

  // Save event to localStorage (optional)
  let savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
  savedEvents.push({ title, desc, date, time, emails: emailList, reminderMins });
  localStorage.setItem("events", JSON.stringify(savedEvents));

  // Schedule reminder notification
  scheduleNotification(title, date, time, reminderMins);

  // Show immediate notification
  if (Notification.permission === "granted") {
    new Notification(`📅 Event Saved: ${title}`, {
      body: `Date: ${date}, Time: ${time}`,
      icon: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
    });
  }

  closeModal();
  alert("Event saved and reminders scheduled!");
});

function scheduleNotification(title, date, time, reminderMins) {
  const eventDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  const reminderTime = new Date(eventDateTime.getTime() - reminderMins * 60000);

  if (reminderTime > now) {
    const timeout = reminderTime.getTime() - now.getTime();
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(`⏰ Reminder: ${title}`, {
          body: `Your event is in ${reminderMins} minutes.`,
          icon: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
        });
      }
    }, timeout);
  }
}

// Initial render
generateCalendar();
document.getElementById("eventForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const emails = document.getElementById("emails").value;

  const payload = { title, desc, date, time, emails };

  try {
    const response = await fetch("/add_event/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert(data.message);
      closeModal();
      generateCalendar();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    alert("Network error: " + error.message);
  }
});

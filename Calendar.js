  // Store bookings by unit/year/month
  let bookings = {
    karl: {},
    kyle: {}
  };

  let currentDate = new Date();
  let currentUnit = 'karl';

  function loadBookings() {
    const saved = localStorage.getItem("calendarBookingsByUnitYear");
    if (saved) {
      const obj = JSON.parse(saved);
      if (obj.karl) bookings.karl = obj.karl;
      if (obj.kyle) bookings.kyle = obj.kyle;
    }
  }

  function saveBookings() {
    localStorage.setItem("calendarBookingsByUnitYear", JSON.stringify(bookings));
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    document.getElementById('current-month-year').textContent = `${monthName} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';

    for (let i = 0; i < startDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.classList.add('day', 'empty');
      daysGrid.appendChild(emptyDiv);
    }

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

for (let d = 1; d <= daysInMonth; d++) {
  const dayDiv = document.createElement('div');
  dayDiv.classList.add('day');
  dayDiv.textContent = d;
  dayDiv.dataset.date = d;

  // Disable past days
  if (
    currentYear > currentDate.getFullYear() ||
    (currentYear === currentDate.getFullYear() && currentMonth > currentDate.getMonth()) ||
    (currentYear === currentDate.getFullYear() && currentMonth === currentDate.getMonth() && d < currentDay)
  ) {
    dayDiv.classList.add('past-day'); // add a special class
    dayDiv.style.pointerEvents = 'none'; // disable click
    dayDiv.style.opacity = '0.4'; // visually dim past days
  }

  daysGrid.appendChild(dayDiv);
}


    applyBookings();
  }

  function applyBookings() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const unitBookings = bookings[currentUnit] || {};
    const yearBookings = unitBookings[year] || {};
    const monthBookings = yearBookings[month] || [];

    monthBookings.forEach(({ start, end }) => {
      for (let d = start; d <= end; d++) {
        const dayEl = document.querySelector(`.day[data-date="${d}"]`);
        if (dayEl) dayEl.classList.add('booked');
      }
    });

    updateBookingsList();
  }

  function updateBookingsList() {
    const container = document.getElementById('bookings-container');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const unitBookings = bookings[currentUnit] || {};
    const yearBookings = unitBookings[year] || {};
    const monthBookings = yearBookings[month] || [];

    if (monthBookings.length === 0) {
      container.textContent = 'No current bookings.';
      return;
    }

    container.innerHTML = '';

    monthBookings.forEach(({ start, end, name, contact, email, numPax }, i) => {
      const div = document.createElement('div');
      div.classList.add('booking-item');

      div.innerHTML = `
        <span>${name} (${start}–${end}, ${numPax} pax) - ${contact}, ${email}</span>
        <button onclick="removeBooking(${i})">Remove</button>
      `;

      container.appendChild(div);
    });
  }

  function bookRange() {
    const name = document.getElementById('booking-name').value.trim();
    const contact = document.getElementById('contact-number').value.trim();
    const email = document.getElementById('email').value.trim();
    const numPax = parseInt(document.getElementById('num-pax').value, 10);
    const start = parseInt(document.getElementById('start-date').value, 10);
    const end = parseInt(document.getElementById('end-date').value, 10);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (!name || !contact || !email || isNaN(numPax) || isNaN(start) || isNaN(end) ||
        start < 1 || end < 1 || numPax < 1 || start > daysInMonth || end > daysInMonth || start > end) {
      alert(`Enter valid details: date range 1-${daysInMonth}.`);
      return;
    }

    if (!bookings[currentUnit][year]) bookings[currentUnit][year] = {};
    if (!bookings[currentUnit][year][month]) bookings[currentUnit][year][month] = [];

    const overlap = bookings[currentUnit][year][month].some(b => !(end < b.start || start > b.end));
    if (overlap) {
      alert('This range overlaps with an existing booking.');
      return;
    }

    bookings[currentUnit][year][month].push({ start, end, name, contact, email, numPax });
    saveBookings();
    renderCalendar();

    document.getElementById('bookingForm').reset();
  }

  function removeBooking(i) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    bookings[currentUnit][year][month].splice(i, 1);

    saveBookings();
    renderCalendar();
  }

  // Navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Unit switcher
  document.getElementById('unit-select').addEventListener('change', e => {
    currentUnit = e.target.value;
    renderCalendar();
  });

  loadBookings();
  renderCalendar();

// Show Modal
document.getElementById("showFormBtn").addEventListener("click", () => {
  document.getElementById("modalBg").style.display = "block";
  document.getElementById("modalCard").style.display = "block";
});

// Close Modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modalBg").style.display = "none";
  document.getElementById("modalCard").style.display = "none";
});

// Close modal when clicking background
document.getElementById("modalBg").addEventListener("click", () => {
  document.getElementById("modalBg").style.display = "none";
  document.getElementById("modalCard").style.display = "none";
});

document.getElementById("viewBookingsBtn").addEventListener("click", () => {
  const bookingsList = document.getElementById("bookingsList");
  if (bookingsList.style.display === "none") {
    bookingsList.style.display = "block"; // show
    bookingsList.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    bookingsList.style.display = "none"; // hide
  }
});
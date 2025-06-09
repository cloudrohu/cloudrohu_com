// Variables and DOM elements
const habitNameInput = document.getElementById('habit-name');
const categorySelect = document.getElementById('habit-category');
const periodSelect = document.getElementById('tracking-period');
const addBtn = document.getElementById('add-btn');
const exportBtn = document.getElementById('export-btn');
const darkToggleBtn = document.getElementById('dark-toggle');
const habitsTableBody = document.querySelector('#habits-list tbody');
let trackingPeriod = parseInt(periodSelect.value);

let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Enable add button only when habit name and category are selected
function checkInputs() {
  addBtn.disabled = !(habitNameInput.value.trim() && categorySelect.value);
}

// Generate Table Headers (Day 1, Day 2, ...)
function renderTableHeaders() {
  const theadTr = document.querySelector('#habits-list thead tr');
  // Remove old day headers (from 4th th onwards)
  while (theadTr.children.length > 3) {
    theadTr.removeChild(theadTr.lastChild);
  }
  for (let i = 1; i <= trackingPeriod; i++) {
    const th = document.createElement('th');
    th.textContent = `Day ${i}`;
    theadTr.appendChild(th);
  }
  // Add Edit and Delete headers if not exist
  if (!document.getElementById('edit-header')) {
    const editTh = document.createElement('th');
    editTh.id = 'edit-header';
    editTh.textContent = 'Edit';
    theadTr.appendChild(editTh);
  }
  if (!document.getElementById('delete-header')) {
    const delTh = document.createElement('th');
    delTh.id = 'delete-header';
    delTh.textContent = 'Delete';
    theadTr.appendChild(delTh);
  }
}

// Calculate streak (consecutive true in completed array)
function calculateStreak(completed) {
  let streak = 0;
  for (let i = completed.length - 1; i >= 0; i--) {
    if (completed[i]) streak++;
    else break;
  }
  return streak;
}

// Render all habits in table
function renderHabits() {
  renderTableHeaders();
  habitsTableBody.innerHTML = '';
  if (habits.length === 0) {
    habitsTableBody.innerHTML = `<tr><td colspan="${trackingPeriod + 5}" style="text-align:center; padding:15px;">No habits added yet.</td></tr>`;
    return;
  }

  habits.forEach((habit, index) => {
    const tr = document.createElement('tr');

    // Habit name
    const tdName = document.createElement('td');
    tdName.textContent = habit.name;
    tr.appendChild(tdName);

    // Category
    const tdCat = document.createElement('td');
    tdCat.textContent = habit.category;
    tdCat.classList.add('category');
    tr.appendChild(tdCat);

    // Streak
    const tdStreak = document.createElement('td');
    const streak = calculateStreak(habit.completed);
    tdStreak.textContent = streak;
    tdStreak.classList.add('streak');
    tr.appendChild(tdStreak);

    // Day checkboxes
    for (let i = 0; i < trackingPeriod; i++) {
      const tdDay = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = habit.completed[i] || false;
      checkbox.addEventListener('change', () => {
        habit.completed[i] = checkbox.checked;
        saveHabits();
        renderHabits();
      });
      tdDay.appendChild(checkbox);
      tr.appendChild(tdDay);
    }

    // Edit button
    const tdEdit = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editHabit(index);
    tdEdit.appendChild(editBtn);
    tr.appendChild(tdEdit);

    // Delete button
    const tdDelete = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
      }
    };
    tdDelete.appendChild(delBtn);
    tr.appendChild(tdDelete);

    habitsTableBody.appendChild(tr);
  });
}

// Save habits to localStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Add new habit
function addHabit() {
  const name = habitNameInput.value.trim();
  const category = categorySelect.value;
  if (!name || !category) return;

  // Initialize completed array for trackingPeriod days
  const completed = new Array(trackingPeriod).fill(false);

  habits.push({ name, category, completed });
  saveHabits();
  renderHabits();

  // Reset inputs
  habitNameInput.value = '';
  categorySelect.value = '';
  checkInputs();
}

// Edit habit name and category
function editHabit(index) {
  const habit = habits[index];
  const newName = prompt('Edit habit name:', habit.name);
  if (newName === null) return; // Cancelled
  if (newName.trim() === '') {
    alert('Habit name cannot be empty!');
    return;
  }
  const newCategory = prompt('Edit category:', habit.category);
  if (newCategory === null) return;
  if (newCategory.trim() === '') {
    alert('Category cannot be empty!');
    return;
  }
  habit.name = newName.trim();
  habit.category = newCategory.trim();
  saveHabits();
  renderHabits();
}

// Export habits data as CSV
function exportCSV() {
  if (habits.length === 0) {
    alert('No habits to export.');
    return;
  }

  let csvContent = 'Habit,Category,Streak,';
  for (let i = 1; i <= trackingPeriod; i++) {
    csvContent += `Day ${i},`;
  }
  csvContent += '\n';

  habits.forEach(habit => {
    const streak = calculateStreak(habit.completed);
    let row = `${habit.name},${habit.category},${streak},`;
    habit.completed.forEach(val => {
      row += (val ? '✔' : '✘') + ',';
    });
    csvContent += row + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'habit-tracker.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  // Save dark mode preference
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('darkMode', 'true');
  } else {
    localStorage.setItem('darkMode', 'false');
  }
}

// Restore dark mode on load
function restoreDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
}

// Event listeners
habitNameInput.addEventListener('input', checkInputs);
categorySelect.addEventListener('change', checkInputs);
periodSelect.addEventListener('change', () => {
  trackingPeriod = parseInt(periodSelect.value);
  // Reset all habit completed arrays length when period changes
  habits.forEach(habit => {
    if (habit.completed.length < trackingPeriod) {
      habit.completed = habit.completed.concat(new Array(trackingPeriod - habit.completed.length).fill(false));
    } else if (habit.completed.length > trackingPeriod) {
      habit.completed = habit.completed.slice(0, trackingPeriod);
    }
  });
  saveHabits();
  renderHabits();
});

addBtn.addEventListener('click', addHabit);
exportBtn.addEventListener('click', exportCSV);
darkToggleBtn.addEventListener('click', toggleDarkMode);

// Initial setup
restoreDarkMode();
checkInputs();
renderHabits();
function renderChart() {
  const ctx = document.getElementById('habitChart').getContext('2d');
  
  // Example: total completed days per habit
  const labels = habits.map(h => h.name);
  const data = habits.map(h => h.completed.filter(c => c).length);

  // Destroy old chart if exists
  if(window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Completed Days',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: trackingPeriod
        }
      }
    }
  });
}

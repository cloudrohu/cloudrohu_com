const expenseForm = document.getElementById('expenseForm');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const dateInput = document.getElementById('date');
    const descriptionInput = document.getElementById('description');
    const expenseList = document.getElementById('expenseList');
    const totalExpense = document.getElementById('totalExpense');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function saveExpenses() {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function renderExpenses() {
      expenseList.innerHTML = '';
      let total = 0;

      expenses.forEach((exp, index) => {
        total += parseFloat(exp.amount);

        const li = document.createElement('li');
        li.className = "bg-gray-100 p-3 rounded flex justify-between items-center";

        li.innerHTML = `
          <div>
            <div><strong>₹${exp.amount}</strong> - ${exp.category}</div>
            <div class="text-sm text-gray-600">${exp.date} ${exp.description ? '- ' + exp.description : ''}</div>
          </div>
          <button class="text-red-500 font-bold" onclick="deleteExpense(${index})">×</button>
        `;

        expenseList.appendChild(li);
      });

      totalExpense.textContent = `₹${total.toFixed(2)}`;
    }

    function deleteExpense(index) {
      expenses.splice(index, 1);
      saveExpenses();
      renderExpenses();
    }

    expenseForm.addEventListener('submit', e => {
      e.preventDefault();

      const newExpense = {
        amount: amountInput.value,
        category: categoryInput.value.trim(),
        date: dateInput.value,
        description: descriptionInput.value.trim()
      };

      expenses.push(newExpense);
      saveExpenses();
      renderExpenses();

      expenseForm.reset();
    });

    // Initial render on page load
    renderExpenses();
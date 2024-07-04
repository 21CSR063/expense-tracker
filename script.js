const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const list = document.getElementById('list');
const totalAmount = document.getElementById('total-amount');
const category = document.getElementById('category');

let transactions = [];

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            category: category.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    item.classList.add(transaction.category);

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    totalAmount.innerText = `$${total}`;

    updateChart();
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    init();
}

function updateChart() {
    const income = transactions.filter(transaction => transaction.category === 'income').reduce((acc, transaction) => (acc += transaction.amount), 0);
    const expense = transactions.filter(transaction => transaction.category === 'expense').reduce((acc, transaction) => (acc += transaction.amount), 0) * -1;
    const savings = transactions.filter(transaction => transaction.category === 'savings').reduce((acc, transaction) => (acc += transaction.amount), 0);

    chart.data.datasets[0].data = [income, expense, savings];
    chart.update();
}

function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

form.addEventListener('submit', addTransaction);

const ctx = document.getElementById('doughnutChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Income', 'Expense', 'Savings'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#4caf50', '#f44336', '#f1c40f'],
            borderWidth: 1
        }]
    },
    options: {
        cutoutPercentage: 70
    }
});

init();

// Global Mock Database Array
let globalTransactions = [
    { id: 1, date: "2026-06-01", title: "Monthly Salary Credits", type: "Income", category: "Salary", amount: 65000 },
    { id: 2, date: "2026-06-02", title: "Apartment Rent", type: "Expense", category: "Rent", amount: 18000 },
    { id: 3, date: "2026-06-03", title: "Supermarket Groceries", type: "Expense", category: "Food", amount: 3200 }
];

const categoriesMap = {
    Income: ["Salary", "Investments", "Freelance"],
    Expense: ["Food", "Rent", "Shopping", "Bills"]
};

// ==========================================
// AUTHENTICATION LOGIC ENGINE
// ==========================================
function handleLogin() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMsg = document.getElementById("loginError");

    if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("financeLoggedIn", "true");
        errorMsg.innerText = ""; 
        showDashboardWorkspace();
    } else {
        errorMsg.innerText = "❌ Invalid Username or Security Token";
    }
}

// ONE-CLICK AUTOFILL LOGIC
function autoFillDemoCredentials() {
    document.getElementById("email").value = "admin@gmail.com";
    document.getElementById("password").value = "admin123";
}

function handleLogout() {
    localStorage.removeItem("financeLoggedIn");
    location.reload();
}

function showDashboardWorkspace() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    autoAdjustCategoryOptions();
    calculateMetricsAndRenderTable();
}

function autoAdjustCategoryOptions() {
    let selectedType = document.getElementById("tType").value;
    let categoryDropdown = document.getElementById("tCategory");
    categoryDropdown.innerHTML = "";

    categoriesMap[selectedType].forEach(cat => {
        let opt = document.createElement("option");
        opt.value = cat;
        opt.innerText = cat;
        categoryDropdown.appendChild(opt);
    });
}

function calculateMetricsAndRenderTable(renderList = globalTransactions) {
    let tbody = document.getElementById("ledgerTableBody");
    tbody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    renderList.forEach(t => {
        if(t.type === "Income") totalIncome += t.amount;
        if(t.type === "Expense") totalExpense += t.amount;
    });

    let netBalance = totalIncome - totalExpense;

    renderList.forEach(t => {
        let isInc = t.type === "Income";
        let amtClass = isInc ? "amount-income" : "amount-expense";
        let badgeClass = isInc ? "badge-income" : "badge-expense";
        let prefix = isInc ? "+ ₹" : "- ₹";

        let formattedDate = t.date.split('-').reverse().join('/');

        let row = `<tr>
            <td style="color: #64748b; font-size: 13px;">${formattedDate}</td>
            <td><b>${t.title}</b></td>
            <td><span class="type-badge ${badgeClass}">${t.type}</span></td>
            <td><span style="color:#475569; font-weight:500;">${t.category}</span></td>
            <td class="${amtClass}">${prefix}${t.amount.toLocaleString('en-IN')}</td>
            <td style="text-align: center;">
                <button class="delete-btn" onclick="eraseTransactionItem(${t.id})"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById("cardIncome").innerText = "₹" + totalIncome.toLocaleString('en-IN');
    document.getElementById("cardExpense").innerText = "₹" + totalExpense.toLocaleString('en-IN');
    document.getElementById("cardBalance").innerText = "₹" + netBalance.toLocaleString('en-IN');

    let alertStrip = document.getElementById("budgetAlert");
    if(totalIncome > 0 && (totalExpense >= totalIncome * 0.8)) {
        alertStrip.style.display = "flex";
    } else {
        alertStrip.style.display = "none";
    }
}

function addNewTransactionRecord() {
    let title = document.getElementById("tTitle").value.trim();
    let type = document.getElementById("tType").value;
    let category = document.getElementById("tCategory").value;
    let amount = parseFloat(document.getElementById("tAmount").value);
    let customDate = document.getElementById("tDate").value;

    if(!title || isNaN(amount) || amount <= 0) {
        alert("Please declare all parameters correctly.");
        return;
    }

    let transactionDate = customDate ? customDate : new Date().toISOString().split('T')[0];

    let newRecord = {
        id: Date.now(),
        date: transactionDate,
        title: title,
        type: type,
        category: category,
        amount: amount
    };

    globalTransactions.unshift(newRecord);
    document.getElementById("tTitle").value = "";
    document.getElementById("tAmount").value = "";
    document.getElementById("tDate").value = "";
    
    globalTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    processFilterSearch();
}

function onEndDateChange() {
    let start = document.getElementById("startDate").value;
    if(!start) {
        alert("Select 'From' date first.");
        document.getElementById("endDate").value = "";
        return;
    }
    processFilterSearch();
}

function processFilterSearch() {
    let searchVal = document.getElementById("searchKeyword").value.toLowerCase().trim();
    let typeVal = document.getElementById("filterType").value;
    let categoryVal = document.getElementById("filterCategory").value;
    let startVal = document.getElementById("startDate").value;
    let endVal = document.getElementById("endDate").value;

    let resultList = globalTransactions.filter(t => {
        let matchesSearch = t.title.toLowerCase().includes(searchVal);
        let matchesType = (typeVal === "All") || (t.type === typeVal);
        let matchesCategory = (categoryVal === "All") || (t.category === categoryVal);
        
        let matchesDate = true;
        if (startVal && endVal) {
            matchesDate = (t.date >= startVal && t.date <= endVal);
        } else if (startVal) {
            matchesDate = (t.date >= startVal);
        }

        return matchesSearch && matchesType && matchesCategory && matchesDate;
    });

    calculateMetricsAndRenderTable(resultList);
}

function eraseTransactionItem(id) {
    if(confirm("Permanently erase this statement row entry?")) {
        globalTransactions = globalTransactions.filter(t => t.id !== id);
        processFilterSearch();
    }
}

// On Load Lifecycle Hook
window.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("financeLoggedIn") === "true") {
        showDashboardWorkspace();
    } else {
        document.getElementById("loginPage").style.display = "flex";
        document.getElementById("mainApp").style.display = "none";
    }
});
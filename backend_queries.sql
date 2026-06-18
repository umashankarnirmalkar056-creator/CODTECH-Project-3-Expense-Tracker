-- ========================================================
-- BACKEND DATABASE SCHEMA: EXPENSE TRACKER SYSTEM
-- ========================================================

-- 1. Create Transactions Master Table Schema
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    transaction_type ENUM('Income', 'Expense') NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Initial Mock Data Matrix Rows
INSERT INTO transactions (transaction_date, title, transaction_type, category, amount) VALUES
('2026-06-01', 'Monthly Salary Credits', 'Income', 'Salary', 65000.00),
('2026-06-02', 'Apartment Rent', 'Expense', 'Rent', 18000.00),
('2026-06-03', 'Supermarket Groceries', 'Expense', 'Food', 3200.00);


-- ========================================================
-- BACKEND CRUD OPERATIONS (Executed via API endpoints)
-- ========================================================

-- Authentication & User Validation (Login Query):
SELECT * FROM users WHERE email = 'admin@gmail.com' AND password = 'hashed_password';

-- Insert Operation triggered when user clicks 'Log Transaction':
INSERT INTO transactions (transaction_date, title, transaction_type, category, amount) 
VALUES ('2026-06-04', 'Freelance Project', 'Income', 'Freelance', 12000.00);

-- Financial Metrics Aggregation Query for Dashboard Cards:
SELECT 
    SUM(CASE WHEN transaction_type = 'Income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN transaction_type = 'Expense' THEN amount ELSE 0 END) AS total_expense,
    (SUM(CASE WHEN transaction_type = 'Income' THEN amount ELSE 0 END) - SUM(CASE WHEN transaction_type = 'Expense' THEN amount ELSE 0 END)) AS net_balance
FROM transactions;

-- Date Range & Chronological Month-wise Statement Filter Query:
SELECT * FROM transactions 
WHERE transaction_date >= '2026-05-01' AND transaction_date <= '2026-05-31'
ORDER BY transaction_date DESC;

-- Delete Operation triggered when user clicks the Trash icon:
DELETE FROM transactions WHERE transaction_id = 2;
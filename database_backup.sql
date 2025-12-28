-- =============================================
-- Arena Web Security Database Backup
-- Generated: October 19, 2025
-- Database: PostgreSQL
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- Create Users Table
-- =============================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(500),
    approved VARCHAR(20) NOT NULL DEFAULT 'pending',
    is_admin VARCHAR(10) NOT NULL DEFAULT 'false',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique partial index for first admin
CREATE UNIQUE INDEX unique_first_admin ON users (is_admin) WHERE is_admin = 'true' AND approved = 'approved';

-- =============================================
-- Create Transactions Table
-- =============================================
CREATE TABLE transactions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- =============================================
-- Insert Users Data
-- =============================================
INSERT INTO users (id, email, first_name, last_name, profile_image_url, created_at, updated_at, approved, is_admin) VALUES
('48750746', 'sakib.prf@gmail.com', 'ssss', 'sssss', NULL, '2025-10-19 21:16:25.105458', '2025-10-19 21:50:57.373', 'approved', 'true'),
('second_user_002', 'second@arena.com', 'Second', 'User', NULL, '2025-10-19 21:09:56.053779', '2025-10-19 21:10:42.67', 'approved', 'false'),
('first_user_001', 'first@arena.com', 'First', 'User', NULL, '2025-10-19 21:08:42.852988', '2025-10-19 21:08:42.852988', 'approved', 'false'),
('test_user_txn', 'test@arena.com', 'Test', 'User', NULL, '2025-10-19 21:23:18.386722', '2025-10-19 21:24:56.628437', 'approved', 'false'),
('admin_user_123', 'admin@arenawebsec.com', 'Admin', 'User', NULL, '2025-10-19 21:33:05.748352', '2025-10-19 21:38:22.041', 'pending', 'false'),
('test_user_789', 'test@example.com', 'Test', 'User', NULL, '2025-10-19 21:38:52.021806', '2025-10-19 21:40:46.873', 'approved', 'false'),
('first_admin', 'firstadmin@test.com', 'First', 'Admin', NULL, '2025-10-19 21:43:36.164465', '2025-10-19 21:43:36.164465', 'pending', 'false'),
('second_user', 'second@test.com', 'Second', 'User', NULL, '2025-10-19 21:44:09.161105', '2025-10-19 21:44:09.161105', 'pending', 'false');

-- =============================================
-- Insert Transactions Data
-- =============================================
INSERT INTO transactions (id, user_id, type, category, amount, description, date, created_at) VALUES
('e9602d2c-f8aa-4662-a7a3-25b1ebed4002', 'second_user_002', 'income', 'Student Enrollments', 100.00, 'Test income - API retry', '2025-10-19', '2025-10-19 21:14:17.565333'),
('3fdfcfdb-ff27-4c12-aba2-701cc2cef89e', 'test_user_txn', 'income', 'Student Enrollments', 5000.50, 'Test Income Transaction', '2025-10-19', '2025-10-19 21:25:56.449054'),
('60c1a27f-1848-464d-85a8-58441a36f6e1', 'test_user_txn', 'expense', 'Marketing & Advertising', 1500.25, 'Test Expense Transaction', '2025-10-19', '2025-10-19 21:26:32.328187'),
('789f9d56-5b34-4c60-a927-b9ee5f42397e', '48750746', 'income', 'Certifications', 20000.00, 'ssss', '2025-10-19', '2025-10-19 21:28:18.097932'),
('650b6d05-d6b0-4f2a-8744-172ab8f63817', '48750746', 'expense', 'Other Expenses', 22222.00, 'wwwwww', '2025-10-19', '2025-10-19 21:31:01.769448');

-- =============================================
-- Verify Data
-- =============================================
SELECT 'Users imported: ' || COUNT(*) FROM users;
SELECT 'Transactions imported: ' || COUNT(*) FROM transactions;

-- =============================================
-- End of backup
-- =============================================

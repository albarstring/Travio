-- Remove trailing numbers from user names
UPDATE users SET name = 'Admin' WHERE email = 'admin@example.com';
UPDATE users SET name = 'Sarah Smith' WHERE email = 'instructor@example.com';
UPDATE users SET name = 'John Doe' WHERE email = 'student@example.com';

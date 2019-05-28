INSERT INTO users (type,full_name,username,password, email,phone, city, state, post_code, country, status, role)
VALUES('SYSTEM', 'Administrator', 'admin', password('abc123'), 'manju@manju.com', 01232323, 'KL', 'WP', 560065, 'Malaysia', 1, 'ADMIN');

INSERT INTO users (type,full_name,username,password, email,phone, city, state, post_code, country, status, role)
VALUES('PUBLIC', 'Micheal Schumacher', 'micheal', password('abc123'), 'micheal@manju.com', 01232323, 'KL', 'WP', 560065, 'Malaysia', 1, 'DEALER');

INSERT INTO users (type,full_name,username,password, email,phone, city, state, post_code, country, status, role)
VALUES('PUBLIC', 'Sebastian Vettel', 'seb', password('abc123'), 'seb@manju.com', 01232323, 'KL', 'WP', 560065, 'Malaysia', 1, 'CUSTOMER');

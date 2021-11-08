INSERT INTO department (name)
VALUES 
('High-ranking Officers'),
('Officers'),
('Red-shirts'),
('Engineering');
('Science Team');

INSERT INTO role (title, salary, department_id)
VALUES
('Starship Captian', 100000, 1),
('Science Officer', 95000, 1),
('Lead Engineer', 75000, 2), 
('Upgrade Specialist', 55000, 2),
('Shuttlecraft Pilot', 50000, 3), 
('Transporter Officer', 35000, 3),
('Red-shirt', 1000, 4),
('Communications Officer', 45000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Johnny', 'Nemonic', 2, null),
('David', 'Bowie', 1, 1),
('Tom', 'Petty', 4, null),
('Zach', 'Trumbell', 3, 3),
('Leonard', 'Nemoy', 6, null),
('William', 'Shatner', 5, 5),
('Patrick', 'Stewart', 7, null),
('Nikki', 'Little', 8, 7);
('Alexander', 'Rice', 4, 8);
('Little', 'Richard', 2, 6);

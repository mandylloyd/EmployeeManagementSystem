INSERT INTO department (department_name)
VALUES ("Management");

INSERT INTO department (department_name)
VALUES ("Marketing");

INSERT INTO department (department_name)
VALUES ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 60000, 1), ("Display Coordinator", 50000, 2), ("Floor Associate", 30000, 3), ("Assistant Manager", 50000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mandy", "Lloyd", 1, 1), ("Ashley", "Bruner", 1, 1), ("Hannah", "Couch", 2, 2), ("David", "Quint", 3, 3), ("Sam", "Green", 4, 4);
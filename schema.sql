CREATE DATABASE Bamazon;
USE Bamazon;

CREATE TABLE products(
item_id INTEGER(11) auto_increment not null,
product_name VARCHAR(255),
department_name VARCHAR(255),
price DECIMAL (16,2),
stock_quantity INTEGER(11),
PRIMARY KEY (item_id)
);
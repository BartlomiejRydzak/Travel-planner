create table users(
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(50) NOT NULL UNIQUE,
	pass varchar(150) NOT NULL
);

create table people(
	person_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	user_id int REFERENCES users(user_id) 
);

create table countries(
    country_id SERIAL PRIMARY KEY,
    been varchar(100),
    want varchar(100),
    person_id int REFERENCES people(person_id) ON DELETE CASCADE
)

create table cities(
    city_id SERIAL PRIMARY KEY,
    been varchar(100),
    want varchar(100),
    person_id int REFERENCES people(person_id) ON DELETE CASCADE
)
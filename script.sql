CREATE TABLE pol.osoby (
    osoba_id SERIAL PRIMARY KEY,
    imie VARCHAR(50) NOT NULL
);

CREATE TABLE pol.kraje (
    kraj_id SERIAL PRIMARY KEY,
    nazwa VARCHAR(100) UNIQUE
);

CREATE TABLE pol.osoby_kraje (
    osoby_kraje_id SERIAL PRIMARY KEY,
    osoba_id INT REFERENCES pol.osoby(osoba_id) ON DELETE CASCADE,
    kraj_id INT REFERENCES pol.kraje(kraj_id) ON DELETE CASCADE
);

CREATE TABLE pol.osoby_chca_kraje (
    osoby_chca_kraje_id SERIAL PRIMARY KEY,
    osoba_id INT REFERENCES pol.osoby(osoba_id) ON DELETE CASCADE,
    kraj_id INT REFERENCES pol.kraje(kraj_id) ON DELETE CASCADE
);

-- Widok liczby odwiedzonych krajów
CREATE VIEW pol.widok_odwiedzonych_krajow AS
SELECT 
    o.imie AS osoba,
    COUNT(ok.kraj_id) AS liczba_odwiedzonych_krajow
FROM  
    pol.osoby o
LEFT JOIN 
    pol.osoby_kraje ok ON o.osoba_id = ok.osoba_id
GROUP BY 
    o.imie;

CREATE VIEW pol.widok_krajow_i_liczba_osob AS
SELECT 
    k.nazwa AS kraj,
    COUNT(ok.osoba_id) AS liczba_osob
FROM 
    pol.kraje k
LEFT JOIN 
    pol.osoby_chca_kraje ok ON k.kraj_id = ok.kraj_id
GROUP BY 
    k.nazwa;
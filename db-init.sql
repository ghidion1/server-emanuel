CREATE TABLE programari (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(100),
  prenume VARCHAR(100),
  specialitate VARCHAR(100),
  medic VARCHAR(100),
  data DATE,
  ora TIME,
  telefon VARCHAR(20),
  email VARCHAR(100),
  motiv TEXT,
  mesaj TEXT
);

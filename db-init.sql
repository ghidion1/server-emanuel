-- Tabela programări
CREATE TABLE IF NOT EXISTS programari (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(100) NOT NULL,
  prenume VARCHAR(100) NOT NULL,
  specialitate VARCHAR(100) NOT NULL,
  medic VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  ora TIME NOT NULL,
  telefon VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  motiv TEXT,
  mesaj TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pentru căutări frecvente
CREATE INDEX IF NOT EXISTS idx_programari_data ON programari(data);
CREATE INDEX IF NOT EXISTS idx_programari_medic ON programari(medic);
CREATE INDEX IF NOT EXISTS idx_programari_specialitate ON programari(specialitate);
CREATE INDEX IF NOT EXISTS idx_programari_status ON programari(status);
CREATE INDEX IF NOT EXISTS idx_programari_created ON programari(created_at DESC);


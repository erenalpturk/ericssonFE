-- Users tablosunu oluştur
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    department VARCHAR(100),
    phone_number VARCHAR(20),
    profile_image_url TEXT
);

-- RLS (Row Level Security) politikalarını ayarla
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Tüm kullanıcıların kendi profillerini görebilmesi için politika
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Sadece admin kullanıcıların tüm profilleri görebilmesi için politika
CREATE POLICY "Admins can view all profiles"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Kullanıcıların kendi profillerini güncelleyebilmesi için politika
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Admin kullanıcıların tüm profilleri güncelleyebilmesi için politika
CREATE POLICY "Admins can update all profiles"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Otomatik updated_at güncellemesi için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Örnek admin kullanıcısı oluştur (şifre: admin123)
INSERT INTO users (email, first_name, last_name, role)
VALUES ('admin@example.com', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING; 
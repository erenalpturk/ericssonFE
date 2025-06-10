# API Otomasyon Aracı

Bu proje, ana OMNI tool'ları ile API Otomasyon tool'unu birleştirir.

## Kurulum

1. Gerekli dependency'leri yükleyin:
```bash
npm install
```

2. Supabase konfigürasyonu için `.env.local` dosyası oluşturun:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Projeyi çalıştırın:
```bash
npm run dev
```

## API Otomasyon Aracı Özellikleri

- **Workflow Oluşturma**: API çağrılarından oluşan workflow'lar oluşturun
- **API Step Management**: GET, POST, PUT, DELETE, PATCH destekli API adımları
- **Değişken Yönetimi**: Static ve runtime değişkenler
- **Response Parsing**: API response'larından değişken çıkarımı
- **Workflow Kaydetme**: Supabase ile workflow'ları kaydetme ve yükleme
- **Sonuç Takibi**: API çağrılarının sonuçlarını görüntüleme

## Menü Erişimi

Ana tool'da sol menüden "API Otomasyon" seçeneğine tıklayarak erişebilirsiniz.

## Supabase Database Schema

API Otomasyon aracı için gerekli database tabloları:

```sql
-- Workflows tablosu
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Steps tablosu
CREATE TABLE api_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  url TEXT NOT NULL,
  headers JSONB DEFAULT '{}',
  body TEXT DEFAULT '',
  variables JSONB DEFAULT '{}',
  pre_request_script TEXT DEFAULT '',
  post_response_script TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Global Variables tablosu
CREATE TABLE global_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Teknoloji Stack

- **Frontend**: React 18 + Vite
- **UI Framework**: Bootstrap 5
- **Database**: Supabase (PostgreSQL)
- **Notifications**: React Hot Toast
- **Icons**: Bootstrap Icons

## Önemli Notlar

- Supabase bağlantısı olmadan tool çalışacak ancak workflow kaydetme/yükleme işlevleri devre dışı kalacaktır
- Runtime değişkenler localStorage'da saklanır
- Static değişkenler Supabase database'inde saklanır 
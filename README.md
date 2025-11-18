# Ads API - TikTok & Meta Ads Library Unified API

TikTok ve Meta (Facebook/Instagram) reklam verilerini tek bir API üzerinden çekmek için geliştirilmiş Node.js backend projesi. **n8n otomasyonları** ve diğer integration araçları için hazır.

## 📋 Proje Amacı

Bu API:
- **TikTok ads** → Apify'ın `silva95gustavo/tiktok-ads-scraper` actor'ünü kullanarak çeker
- **Meta ads** → Meta Graph API Ad Library endpoint'i ile çeker
- Her iki platformu **tek tip JSON formatında** (unified schema) döndürür
- n8n, Zapier, Make gibi otomasyonlarda HTTP Request ile kullanılabilir

## 🛠️ Teknolojiler

- **Node.js** (JavaScript - CommonJS)
- **Express.js** - Web framework
- **Apify Client** - TikTok scraping için
- **Axios** - Meta Graph API çağrıları için
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

## 📁 Proje Yapısı

```
ads-api/
├── src/
│   ├── index.js              # Ana server dosyası
│   ├── routes/
│   │   ├── tiktok.js         # TikTok endpoint'leri
│   │   └── meta.js           # Meta endpoint'leri
│   └── services/
│       ├── tiktokService.js  # Apify entegrasyonu
│       └── metaService.js    # Meta Graph API entegrasyonu
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Kurulum ve Başlatma

### 1. Bağımlılıkları Yükle

```powershell
npm install
```

### 2. API Anahtarlarını Yapılandır

`.env` dosyasını düzenle:

```env
# Server Configuration
PORT=3001

# Apify API Configuration (TikTok Scraper)
APIFY_API_TOKEN=your_actual_apify_token
APIFY_TIKTOK_ACTOR_ID=silva95gustavo/tiktok-ads-scraper

# Meta API Configuration
META_ACCESS_TOKEN=your_actual_meta_token
META_API_VERSION=v18.0
```

#### API Token'ları Nasıl Alınır?

**Apify Token (TikTok için):**
1. [Apify](https://apify.com/) hesabı oluştur
2. Settings → Integrations → API tokens
3. Token'ı kopyala ve `.env`'e yapıştır
4. Apify'da `silva95gustavo/tiktok-ads-scraper` actor'ünü kullanabilmek için credit gerekebilir

**Meta Access Token (Facebook/Instagram için):**
1. [Meta for Developers](https://developers.facebook.com/) hesabı oluştur
2. Bir uygulama oluştur (App Type: Business)
3. Graph API Explorer'dan User Access Token al
4. Token'ı `.env`'e yapıştır
5. Not: Ad Library API için özel izinler gerekebilir

> ⚠️ **Önemli:** API token'ları olmadan da API çalışır, ancak **dummy data** döndürür. Gerçek veriler için yukarıdaki token'ları mutlaka ekle.

### 3. Sunucuyu Başlat

```powershell
npm start
```

Server başarıyla başladığında:
```
🚀 Ads API server is running on http://localhost:3001
📋 Health check: http://localhost:3001/health
🎵 TikTok Ads: POST http://localhost:3001/tiktok/ads
📘 Meta Ads: POST http://localhost:3001/meta/ads
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Ads API is running 🚀",
  "timestamp": "2025-11-18T12:00:00.000Z"
}
```

---

### TikTok Ads
```http
POST /tiktok/ads
Content-Type: application/json
```

**Request Body:**
```json
{
  "search_term": "fitness",
  "country": "TR",
  "date_from": "2025-11-01",
  "date_to": "2025-11-18",
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "source": "tiktok_apify",
  "count": 10,
  "params": { ... },
  "data": [
    {
      "platform": "tiktok",
      "ad_id": "7123456789",
      "advertiser_name": "Fitness Brand XYZ",
      "impressions": {
        "lower": 10000,
        "upper": 50000
      },
      "countries": ["TR"],
      "start_date": "2025-11-01",
      "end_date": "2025-11-15",
      "media_url": "https://...",
      "thumbnail_url": "https://...",
      "targeting": {
        "genders": ["male", "female"],
        "age_ranges": ["18-24", "25-34"]
      },
      "search_term_used": "fitness",
      "limit_used": 10,
      "raw_data": {
        "likes": 5000,
        "comments": 200,
        "shares": 150,
        "caption": "..."
      }
    }
  ]
}
```

---

### Meta Ads
```http
POST /meta/ads
Content-Type: application/json
```

**Request Body:**
```json
{
  "search_term": "fitness",
  "country": "TR",
  "ad_type": "ALL",
  "limit": 10
}
```

**Ad Type Options:**
- `ALL` - Tüm reklamlar
- `POLITICAL_AND_ISSUE_ADS` - Politik ve sosyal konular
- `HOUSING` - Emlak reklamları
- `EMPLOYMENT` - İş ilanları
- `CREDIT` - Kredi/finans reklamları

**Response:**
```json
{
  "success": true,
  "source": "meta_graph_api",
  "count": 10,
  "params": { ... },
  "data": [
    {
      "platform": "meta",
      "ad_id": "123456789",
      "page_id": "987654321",
      "page_name": "Fitness Brand Page",
      "impressions": {
        "lower": 5000,
        "upper": 25000
      },
      "countries": ["TR"],
      "start_date": "2025-11-01",
      "end_date": "2025-11-15",
      "media_url": "https://...",
      "thumbnail_url": "https://...",
      "targeting": {
        "genders": ["all"],
        "age_ranges": ["18-65+"]
      },
      "ad_type_used": "ALL",
      "search_term_used": "fitness",
      "limit_used": 10,
      "raw_data": {
        "creative_body": "Ad text content...",
        "link_caption": "Learn more",
        "link_description": "Click to see details",
        "link_title": "Fitness Program",
        "currency": "USD",
        "spend": { "lower_bound": 100, "upper_bound": 500 },
        "platforms": ["facebook", "instagram"]
      }
    }
  ]
}
```

## 🔗 n8n Entegrasyonu

### n8n'de Kullanım

1. **HTTP Request** node ekle
2. **Method**: `POST`
3. **URL**: `http://localhost:3001/tiktok/ads` veya `.../meta/ads`
4. **Body Content Type**: `JSON`
5. **Body** (JSON):
   ```json
   {
     "search_term": "{{ $json.keyword }}",
     "country": "TR",
     "limit": 10
   }
   ```

### Örnek n8n Workflow

```
Trigger (Schedule/Webhook)
  ↓
HTTP Request → TikTok Ads API
  ↓
Code Node → Veriyi işle/filtrele
  ↓
Google Sheets → Kaydet
  ↓
Slack → Bildirim gönder
```

### PowerShell Test Komutları

**Health Check:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get | ConvertTo-Json
```

**TikTok Ads:**
```powershell
$body = @{
    search_term = "fitness"
    country = "TR"
    limit = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/tiktok/ads" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

**Meta Ads:**
```powershell
$body = @{
    search_term = "fitness"
    country = "TR"
    ad_type = "ALL"
    limit = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/meta/ads" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 🎯 Unified Schema

Her iki platform da aynı temel yapıyı döndürür:

```typescript
{
  platform: "tiktok" | "meta",
  ad_id: string,
  advertiser_name?: string,  // TikTok'ta var
  page_name?: string,         // Meta'da var
  page_id?: string,           // Meta'da var
  impressions: {
    lower: number,
    upper: number
  },
  countries: string[],
  start_date: string,
  end_date: string,
  media_url: string,
  thumbnail_url: string,
  targeting: {
    genders: string[],
    age_ranges: string[]
  },
  search_term_used: string,
  limit_used: number,
  raw_data: object  // Platform-specific extra fields
}
```

## 🔧 Hata Yönetimi

### API Token Eksikse
- Response: `source: "tiktok_dummy"` veya `"meta_dummy"`
- Dummy data döndürülür
- Console'da warning logu görünür

### Rate Limit Aşımı
```json
{
  "success": false,
  "error": "Meta API rate limit exceeded. Please try again later."
}
```

### Authentication Hatası
```json
{
  "success": false,
  "error": "Meta API authentication failed. Check your access token."
}
```

## 📝 Geliştirme Notları

### Port Değiştirme
`.env` dosyasında `PORT=3001` değerini istediğiniz porta değiştirin.

### Loglama
Console'da detaylı loglar göreceksin:
- `📥` Request parametreleri
- `🎵` Apify çağrıları (TikTok)
- `📘` Meta API çağrıları
- `✅` Başarılı yanıtlar
- `❌` Hatalar

### Test Modu
Token'ları `.env`'de `your_apify_token_here` olarak bırakırsan API dummy data modunda çalışır.

## 🐛 Sorun Giderme

**Port 3000 zaten kullanımda:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**npm install hataları:**
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

**API çağrıları timeout veriyor:**
- Apify credit'inizin olduğundan emin olun
- Meta token'ının geçerli olduğundan emin olun
- İnternet bağlantınızı kontrol edin

## 📄 License

ISC

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açın.

---

**Hazırlayan:** AI-powered development
**Tarih:** Kasım 2025
**Versiyon:** 1.0.0

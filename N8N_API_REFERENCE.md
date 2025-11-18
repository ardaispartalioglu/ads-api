# 🔗 API Endpoint Bilgileri (n8n İçin)

## Production URL

```
https://your-railway-url.up.railway.app
```

⚠️ **Railway deploy ettikten sonra yukarıdaki URL'i gerçek URL'inle değiştir!**

---

## 📡 API Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Kullanım:** API'nin çalışıp çalışmadığını kontrol eder.

**n8n HTTP Request Config:**
```json
{
  "method": "GET",
  "url": "https://your-railway-url.up.railway.app/health"
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Ads API is running 🚀",
  "timestamp": "2025-11-18T13:29:15.510Z"
}
```

---

### 2. TikTok Ads Search

**Endpoint:** `POST /tiktok/ads`

**Kullanım:** Keyword ile TikTok reklamlarını arar.

**n8n HTTP Request Config:**
```json
{
  "method": "POST",
  "url": "https://your-railway-url.up.railway.app/tiktok/ads",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "search_term": "{{ $json.keyword }}",
    "country": "TR",
    "limit": 10,
    "date_from": "2025-11-01",
    "date_to": "2025-11-18"
  },
  "options": {
    "timeout": 60000
  }
}
```

**Input Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| `search_term` | string | ❌ | "" | Aranacak keyword |
| `country` | string | ❌ | "TR" | Ülke kodu (TR, US, UK, vb.) |
| `limit` | number | ❌ | 10 | Maksimum sonuç sayısı |
| `date_from` | string | ❌ | "2025-11-01" | Başlangıç tarihi (YYYY-MM-DD) |
| `date_to` | string | ❌ | "2025-11-18" | Bitiş tarihi (YYYY-MM-DD) |

**Output Format:**
```json
{
  "success": true,
  "source": "tiktok_apify",
  "count": 10,
  "params": {
    "search_term": "fitness",
    "country": "TR",
    "limit": 10
  },
  "data": [
    {
      "platform": "tiktok",
      "ad_id": "7123456789",
      "advertiser_name": "Fitness Brand",
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

**n8n'de Kullanım (Örnek Expressions):**
```javascript
// İlk reklamın advertiser'ı
{{ $json.data[0].advertiser_name }}

// Toplam reklam sayısı
{{ $json.count }}

// Her reklam için loop
{{ $json.data.map(ad => ad.ad_id).join(', ') }}

// İmpression ortalaması
{{ ($json.data[0].impressions.lower + $json.data[0].impressions.upper) / 2 }}
```

---

### 3. Meta Ads Search

**Endpoint:** `POST /meta/ads`

**Kullanım:** Keyword ile Meta (Facebook/Instagram) reklamlarını arar.

**n8n HTTP Request Config:**
```json
{
  "method": "POST",
  "url": "https://your-railway-url.up.railway.app/meta/ads",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "search_term": "{{ $json.keyword }}",
    "country": "TR",
    "ad_type": "ALL",
    "limit": 10
  },
  "options": {
    "timeout": 30000
  }
}
```

**Input Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| `search_term` | string | ❌ | "" | Aranacak keyword |
| `country` | string | ❌ | "TR" | Ülke kodu (TR, US, UK, vb.) |
| `ad_type` | string | ❌ | "ALL" | Reklam tipi (aşağıda açıklandı) |
| `limit` | number | ❌ | 10 | Maksimum sonuç sayısı |

**Ad Type Seçenekleri:**
- `ALL` - Tüm reklamlar
- `POLITICAL_AND_ISSUE_ADS` - Politik ve sosyal konu reklamları
- `HOUSING` - Emlak reklamları
- `EMPLOYMENT` - İş ilanları
- `CREDIT` - Kredi/finans reklamları

**Output Format:**
```json
{
  "success": true,
  "source": "meta_graph_api",
  "count": 10,
  "params": {
    "search_term": "fitness",
    "country": "TR",
    "ad_type": "ALL",
    "limit": 10
  },
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
        "creative_body": "Ad text...",
        "link_caption": "Learn more",
        "link_description": "Click to see",
        "link_title": "Fitness Program",
        "currency": "USD",
        "spend": {
          "lower_bound": 100,
          "upper_bound": 500
        },
        "platforms": ["facebook", "instagram"]
      }
    }
  ]
}
```

**n8n'de Kullanım (Örnek Expressions):**
```javascript
// Page name
{{ $json.data[0].page_name }}

// Spend ortalaması
{{ ($json.data[0].raw_data.spend.lower_bound + $json.data[0].raw_data.spend.upper_bound) / 2 }}

// Platform listesi
{{ $json.data[0].raw_data.platforms.join(', ') }}

// Creative body (reklam metni)
{{ $json.data[0].raw_data.creative_body }}
```

---

## 🔄 n8n Workflow Örnekleri

### Örnek 1: Basit Keyword Search

```
[Manual Trigger]
    ↓
[Set Node] → keyword: "fitness"
    ↓
[HTTP Request] → POST /tiktok/ads
    ↓
[Code Node] → data[0].advertiser_name çıkar
    ↓
[Send Email] → Sonucu gönder
```

### Örnek 2: Schedule ile Otomatik Search

```
[Schedule Trigger] → Her gün 09:00
    ↓
[Set Node] → keyword: "teknoloji"
    ↓
[HTTP Request] → POST /meta/ads
    ↓
[Google Sheets] → Sonuçları kaydet
    ↓
[Slack] → Bildirim gönder
```

### Örnek 3: Çoklu Platform Karşılaştırma

```
[Webhook Trigger] → keyword al
    ↓
[Split in Batches] → 2 parallel request
    ├─ [HTTP Request] → TikTok
    └─ [HTTP Request] → Meta
    ↓
[Merge] → İki sonucu birleştir
    ↓
[Code Node] → Karşılaştır
    ↓
[Notion] → Rapor oluştur
```

---

## ⚡ Performance Tips

### Timeout Ayarları
- **TikTok:** 60 saniye (Apify scraping uzun sürebilir)
- **Meta:** 30 saniye (Graph API genelde hızlı)

### Rate Limiting
- Her endpoint için dakikada max 10 request önerilir
- n8n'de "Wait" node ekle (request'ler arası 6 saniye)

### Error Handling
n8n'de "Continue on Fail" aktif et:
```json
{
  "continueOnFail": true,
  "alwaysOutputData": true
}
```

---

## 🐛 Hata Yönetimi

### Olası Hatalar ve Çözümleri

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "..."
}
```
→ Railway logs kontrol et
→ API token'lar doğru mu?

**Timeout:**
→ n8n timeout'u artır (60s)
→ limit parametresini düşür (5-10)

**Empty Response:**
→ `source` field kontrol et
→ `tiktok_dummy` veya `meta_dummy` ise token eksik

---

## 📊 Response Source Types

| Source | Anlamı | Aksiyon |
|--------|--------|---------|
| `tiktok_dummy` | Test verisi | API token ekle |
| `tiktok_apify` | Gerçek veri | ✅ Hazır |
| `meta_dummy` | Test verisi | API token ekle |
| `meta_graph_api` | Gerçek veri | ✅ Hazır |

---

## 🔐 Güvenlik

### API Key Koruması (Opsiyonel)

Eğer API'yi public'e açmak istemiyorsan:

**Railway'de environment variable ekle:**
```
API_KEY=super_secret_key_123
```

**n8n'de header ekle:**
```json
{
  "headers": {
    "x-api-key": "super_secret_key_123"
  }
}
```

---

## 📝 Quick Reference

**Base URL:**
```
https://your-railway-url.up.railway.app
```

**Endpoints:**
- `GET /health` → Health check
- `POST /tiktok/ads` → TikTok search
- `POST /meta/ads` → Meta search

**Common Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Common Body:**
```json
{
  "search_term": "{{ $json.keyword }}",
  "country": "TR",
  "limit": 10
}
```

---

## ✅ Test Checklist (n8n'de kullanmadan önce)

- [ ] Railway'de deployed
- [ ] Health endpoint test edildi
- [ ] TikTok endpoint test edildi
- [ ] Meta endpoint test edildi
- [ ] Response formatı doğru
- [ ] n8n'de HTTP Request node kuruldu
- [ ] Keyword dinamik olarak geçiliyor
- [ ] Error handling eklendi

**Hepsi tamam mı? n8n workflow'una ekleyebilirsin! 🚀**

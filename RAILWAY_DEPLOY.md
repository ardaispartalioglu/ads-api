# 🚀 Railway.app Deployment Rehberi

## Adım Adım Railway'e Deploy

### 1️⃣ GitHub Repo Oluştur

**Tarayıcıda:**
1. https://github.com → Sign in (veya Sign up)
2. Sağ üstte **+** → **New repository**
3. Repository name: `ads-api`
4. Description: `TikTok & Meta Ads Library Unified API`
5. **Public** veya **Private** seç (her ikisi de çalışır)
6. ❌ README, .gitignore, license ekleme (zaten var)
7. **Create repository**

**Terminal'de (PowerShell):**
```powershell
cd C:\ads-api

# GitHub'daki repo URL'ini kopyala (örnek: https://github.com/USERNAME/ads-api.git)
git remote add origin https://github.com/USERNAME/ads-api.git

# Main branch oluştur
git branch -M main

# Push et
git push -u origin main
```

✅ GitHub'da kodların göründüğünü doğrula!

---

### 2️⃣ Railway Hesabı Oluştur

1. https://railway.app → **Start a New Project**
2. **Login with GitHub** (önerilen)
3. Railway'e GitHub erişimi ver
4. Dashboard açılacak

---

### 3️⃣ Yeni Proje Oluştur

Railway Dashboard'da:

1. **+ New Project** butonuna tıkla
2. **Deploy from GitHub repo** seç
3. `ads-api` repo'sunu listeden bul ve seç
4. Railway otomatik detect eder:
   - ✅ Node.js project algılar
   - ✅ `npm install` çalıştırır
   - ✅ `npm start` ile başlatır
5. **Deploy** başlar (1-2 dakika)

---

### 4️⃣ Environment Variables Ekle

Deploy bittikten sonra:

1. Projeye tıkla
2. **Variables** tab'ına git
3. Şu değişkenleri ekle:

```env
PORT=3001
APIFY_API_TOKEN=your_apify_token_here
META_ACCESS_TOKEN=your_meta_token_here
APIFY_TIKTOK_ACTOR_ID=silva95gustavo/tiktok-ads-scraper
META_API_VERSION=v18.0
```

**ÖNEMLİ:** 
- Token'lar şimdilik `your_apify_token_here` olarak kalabilir
- API dummy data modunda çalışır
- İleride gerçek token ekleyebilirsin

4. **Add** butonuna bas
5. Otomatik **Redeploy** olur

---

### 5️⃣ Public URL Al

1. **Settings** tab'ına git
2. **Networking** bölümünde
3. **Generate Domain** butonuna tıkla
4. Railway otomatik domain verir:
   ```
   https://ads-api-production-xxxx.up.railway.app
   ```
5. URL'i kopyala! 📋

---

### 6️⃣ Test Et!

**PowerShell'de:**

```powershell
# URL'i değiştir (kendi Railway URL'in)
$BASE_URL = "https://ads-api-production-xxxx.up.railway.app"

# Health check
Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get | ConvertTo-Json

# TikTok endpoint (dummy data)
$body = @{
    search_term = "fitness"
    country = "TR"
    limit = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/tiktok/ads" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5

# Meta endpoint (dummy data)
$body = @{
    search_term = "fitness"
    country = "TR"
    ad_type = "ALL"
    limit = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/meta/ads" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

✅ Eğer response geliyorsa, **BAŞARILI!** 🎉

---

## 📊 Railway Dashboard Özellikleri

### Logs Görüntüleme
- **Deployments** → Son deployment'a tıkla
- **View Logs** ile gerçek zamanlı logları gör
- Console.log'lar burada görünür

### Metrics
- CPU kullanımı
- Memory kullanımı
- Network trafiği
- Request sayısı

### Restart
- **Settings** → **Restart**
- API crash olursa otomatik restart eder

---

## 💰 Maliyet Hesabı

### Ücretsiz Tier
- **500 saat/ay** ücretsiz
- Günde ~16 saat çalışabilir
- Küçük projeler için yeterli

### Kullanım Stratejisi
API'yi sadece ihtiyaç olduğunda çalıştırmak için:

**Seçenek 1:** Manuel start/stop
- Railway dashboard → Pause/Resume

**Seçenek 2:** Scheduled deployment
- n8n workflow'unda kullanmadan önce wake-up request at

**Seçenek 3:** Upgrade to Hobby ($5/ay)
- 24/7 çalışır
- Sınırsız saat
- Daha fazla kaynak

---

## 🔄 Kod Güncellemesi (GitHub Push ile Otomatik Deploy)

Kodda değişiklik yaptığında:

```powershell
cd C:\ads-api

# Değişiklikleri stage'e al
git add .

# Commit oluştur
git commit -m "Updated feature X"

# GitHub'a push et
git push

# Railway otomatik detect eder ve redeploy eder! 🚀
```

---

## 🆘 Sorun Giderme

### Deploy Başarısız
1. Railway logs'u kontrol et
2. `package.json` içinde `start` script var mı?
3. `engines` field doğru mu?

### API'ye Ulaşılamıyor
1. Railway'de service running mu? (Dashboard'da yeşil ✅)
2. Public domain generate edilmiş mi?
3. Environment variables doğru mu?

### 500 Saat Bitti
1. Dashboard → Billing → Usage kontrol et
2. Upgrade to Hobby ($5/ay)
3. Veya alternatif: Render.com (unlimited ama yavaş)

---

## 🎯 n8n İçin Hazırlık

Railway URL'i aldıktan sonra n8n'de kullanmak için:

**Örnek HTTP Request Node Config:**

```json
{
  "method": "POST",
  "url": "https://your-railway-url.up.railway.app/tiktok/ads",
  "authentication": "none",
  "body": {
    "search_term": "{{ $json.keyword }}",
    "country": "TR",
    "limit": 10
  },
  "options": {
    "timeout": 60000
  }
}
```

**Not:** Apify scraping 10-30 saniye sürebilir, timeout'u yüksek tut!

---

## ✅ Checklist

Deploy tamamlandığında:

- [ ] GitHub repo oluşturuldu ve push edildi
- [ ] Railway project oluşturuldu
- [ ] Environment variables eklendi
- [ ] Public domain generate edildi
- [ ] Health endpoint test edildi
- [ ] TikTok endpoint test edildi (dummy data)
- [ ] Meta endpoint test edildi (dummy data)
- [ ] URL kaydedildi (n8n için)

**Tamamsa proje LIVE! 🚀**

---

## 📝 Railway URL'ini Kaydet

Deploy tamamlandığında URL'i buraya yaz:

```
Production URL: https://_____________________________.up.railway.app
```

Bu URL'i n8n workflow'unda kullanacaksın!

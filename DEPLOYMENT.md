# 🚀 Cloud Deployment Rehberi

Bu API'yi cloud'a deploy etmek için birçok seçenek var. İşte en popüler ve kolay olanları:

---

## 🎯 Önerilen: Railway.app (En Kolay)

### Neden Railway?
- ✅ Ücretsiz tier (500 saat/ay)
- ✅ GitHub ile otomatik deploy
- ✅ Environment variables kolay yönetim
- ✅ Public URL otomatik
- ✅ Logs ve monitoring dahili

### Adım Adım:

#### 1. GitHub'a Push
```powershell
cd C:\ads-api
git init
git add .
git commit -m "Initial commit: Ads API"

# GitHub'da yeni repo oluştur, sonra:
git remote add origin https://github.com/KULLANICI_ADI/ads-api.git
git push -u origin main
```

#### 2. Railway'e Deploy
1. [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. `ads-api` repo'sunu seç
4. Railway otomatik detect eder ve deploy eder

#### 3. Environment Variables Ekle
Railway dashboard'da:
- **Variables** tab'ına git
- Şunları ekle:
  ```
  APIFY_API_TOKEN=apify_api_xxxxxxxx
  META_ACCESS_TOKEN=EAAxxxxxxxxxx
  PORT=3001
  ```
- **Deploy** butonuna bas

#### 4. Public URL Al
- **Settings** → **Generate Domain**
- URL örneği: `https://ads-api-production-xxxx.up.railway.app`

#### 5. Test Et
```powershell
$url = "https://ads-api-production-xxxx.up.railway.app"
Invoke-RestMethod -Uri "$url/health" -Method Get
```

---

## 🌐 Alternatif 1: Render.com

### Avantajlar
- Ücretsiz tier kalıcı (15 dakika inactivity'den sonra uyur)
- Auto-deploy from GitHub
- SSL sertifikası dahil

### Adımlar:
1. GitHub'a push (yukardaki gibi)
2. [render.com](https://render.com) → New Web Service
3. GitHub repo'yu bağla
4. Build command: `npm install`
5. Start command: `npm start`
6. Environment variables ekle
7. Create Web Service

**URL:** `https://ads-api.onrender.com`

---

## ⚡ Alternatif 2: Vercel (Serverless)

### Avantajlar
- Tamamen ücretsiz
- Edge network (çok hızlı)
- Otomatik HTTPS

### Dikkat
- Serverless architecture (her request yeni container)
- Apify scraping uzun sürebilir (10s timeout)
- Uzun API çağrıları için uygun değil

### Adımlar:
```powershell
# Vercel CLI kur
npm install -g vercel

# Deploy et
cd C:\ads-api
vercel

# Environment variables ekle
vercel env add APIFY_API_TOKEN
vercel env add META_ACCESS_TOKEN

# Production deploy
vercel --prod
```

**URL:** `https://ads-api.vercel.app`

---

## 🐳 Alternatif 3: Docker + Heroku

### Dockerfile Oluştur
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Heroku Deploy:
```powershell
# Heroku CLI kur ve login
heroku login

# Yeni app oluştur
heroku create ads-api-turkiye

# Environment variables
heroku config:set APIFY_API_TOKEN=xxx
heroku config:set META_ACCESS_TOKEN=xxx

# Deploy
git push heroku main

# Logs
heroku logs --tail
```

**URL:** `https://ads-api-turkiye.herokuapp.com`

---

## 📊 Platform Karşılaştırması

| Platform | Ücretsiz Tier | Auto-Deploy | Kolay Kurulum | Önerilen? |
|----------|---------------|-------------|---------------|-----------|
| **Railway** | 500h/ay | ✅ | ⭐⭐⭐⭐⭐ | ✅ Evet |
| **Render** | Sınırsız (yavaş) | ✅ | ⭐⭐⭐⭐ | ✅ Evet |
| **Vercel** | Sınırsız | ✅ | ⭐⭐⭐⭐⭐ | ⚠️ Timeout riski |
| **Heroku** | Yok (ücretli) | ✅ | ⭐⭐⭐ | ❌ Artık ücretsiz değil |
| **DigitalOcean** | 200$/credit | ❌ | ⭐⭐ | ⚠️ Manuel setup |

---

## 🔐 Güvenlik Önerileri

### 1. Environment Variables
API token'larını asla kodda tutma:
```javascript
// ❌ YANLIŞ
const token = "apify_api_xxx";

// ✅ DOĞRU
const token = process.env.APIFY_API_TOKEN;
```

### 2. Rate Limiting Ekle
```powershell
npm install express-rate-limit
```

`src/index.js` içine ekle:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // 100 request
});

app.use(limiter);
```

### 3. CORS Sınırla
```javascript
// Sadece belirli domain'lere izin ver
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:3000']
}));
```

### 4. API Key Authentication (opsiyonel)
```javascript
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

---

## 🧪 Production Test Checklist

Deploy ettikten sonra şunları test et:

```powershell
$BASE_URL = "https://your-deployed-url.com"

# Health check
Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get

# TikTok endpoint
$body = @{ search_term="test"; country="TR"; limit=2 } | ConvertTo-Json
Invoke-RestMethod -Uri "$BASE_URL/tiktok/ads" -Method Post -Body $body -ContentType "application/json"

# Meta endpoint
$body = @{ search_term="test"; country="TR"; limit=2 } | ConvertTo-Json
Invoke-RestMethod -Uri "$BASE_URL/meta/ads" -Method Post -Body $body -ContentType "application/json"
```

---

## 📱 n8n'de Production URL Kullanımı

Deploy ettikten sonra n8n workflow'unda:

1. HTTP Request node
2. URL: `https://your-deployed-url.com/tiktok/ads`
3. Method: POST
4. Body:
   ```json
   {
     "search_term": "{{ $json.keyword }}",
     "country": "TR",
     "limit": 10
   }
   ```

**Artık lokal sunucu çalıştırmana gerek yok!** ✨

---

## 💰 Maliyet Tahmini

### Ücretsiz Tier ile:
- Railway: 500 saat/ay = ~16 saat/gün (yeterli)
- Render: Sınırsız ama yavaş başlatma
- Vercel: Sınırsız request ama timeout riski

### Ücretli Tier'e Ne Zaman Geçilmeli?
- Günde >500 request varsa
- Apify/Meta API limitleri aşılıyorsa
- 7/24 uptime gerekiyorsa
- Caching/database eklenmişse

**Railway Pro:** $5/ay
**Render Standard:** $7/ay  
**DigitalOcean Droplet:** $6/ay

---

## 🎯 Hızlı Başlangıç (Railway ile)

```powershell
# 1. GitHub'a push
git init
git add .
git commit -m "Deploy ready"
git remote add origin https://github.com/USERNAME/ads-api.git
git push -u origin main

# 2. Railway.app → Deploy from GitHub → ads-api seç

# 3. Environment variables ekle (dashboard'dan)

# 4. Public URL kopyala

# 5. Test et
Invoke-RestMethod -Uri "https://your-url.railway.app/health"
```

**5 dakikada canlı!** 🚀

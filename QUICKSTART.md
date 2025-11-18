# ✅ Railway Deploy - Hızlı Başlangıç

## 🎯 Şu Anda Neredeyiz?

✅ Kod tamam ve Git'e commit edildi  
⏳ GitHub'a push gerekli  
⏳ Railway'e deploy gerekli

---

## 📋 Sıradaki Adımlar (5 Dakika)

### 1. GitHub'da Repo Oluştur (2 dakika)

**Tarayıcıda:**
1. https://github.com → Sign in
2. Sağ üstte **+** → **New repository**
3. Name: `ads-api`
4. ❌ README ekleme (zaten var)
5. **Create repository**

**PowerShell'de:**
```powershell
cd C:\ads-api

# GitHub'daki repo URL'ini buraya yapıştır
git remote add origin https://github.com/KULLANICI_ADI/ads-api.git

git branch -M main
git push -u origin main
```

✅ GitHub'da dosyaların göründüğünü kontrol et!

---

### 2. Railway'e Deploy (3 dakika)

**Tarayıcıda:**
1. https://railway.app → **Login with GitHub**
2. **+ New Project**
3. **Deploy from GitHub repo**
4. `ads-api` seç
5. Otomatik deploy başlar!

**Environment Variables Ekle:**
1. Proje → **Variables** tab
2. Şunları ekle:
   ```
   PORT=3001
   APIFY_API_TOKEN=your_apify_token_here
   META_ACCESS_TOKEN=your_meta_token_here
   ```
   *(Şimdilik fake token'lar olabilir, dummy data döner)*
3. **Add** → Otomatik redeploy

**Public URL Al:**
1. **Settings** → **Networking**
2. **Generate Domain**
3. URL'i kopyala: `https://ads-api-production-xxxx.up.railway.app`

---

### 3. Test Et! (1 dakika)

```powershell
# Railway URL'ini buraya yapıştır
$URL = "https://ads-api-production-xxxx.up.railway.app"

# Health check
Invoke-RestMethod -Uri "$URL/health" -Method Get | ConvertTo-Json

# TikTok test
$body = @{ search_term="test"; country="TR"; limit=2 } | ConvertTo-Json
Invoke-RestMethod -Uri "$URL/tiktok/ads" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

✅ Response geliyorsa **BAŞARILI!** 🎉

---

## 🔗 n8n İçin

**Production URL:**
```
https://ads-api-production-xxxx.up.railway.app
```

**n8n HTTP Request Node:**
- Method: `POST`
- URL: `https://your-url.up.railway.app/tiktok/ads`
- Body:
  ```json
  {
    "search_term": "{{ $json.keyword }}",
    "country": "TR",
    "limit": 10
  }
  ```

**Detaylı bilgi:** `N8N_API_REFERENCE.md` dosyasına bak!

---

## 💰 Maliyet

**Ücretsiz Tier:**
- 500 saat/ay (günde ~16 saat)
- Tamamen ücretsiz başla
- İhtiyaç olursa $5/ay'a upgrade et

---

## 📚 Dosya Referansı

| Dosya | İçerik |
|-------|--------|
| `RAILWAY_DEPLOY.md` | Detaylı Railway deployment rehberi |
| `N8N_API_REFERENCE.md` | n8n için API kullanım kılavuzu |
| `DEPLOYMENT.md` | Tüm cloud platformları karşılaştırması |
| `README.md` | Genel proje dokümantasyonu |

---

## ✅ Deploy Checklist

- [ ] GitHub repo oluşturuldu
- [ ] Kod push edildi
- [ ] Railway project oluşturuldu
- [ ] Deploy tamamlandı
- [ ] Environment variables eklendi
- [ ] Public domain oluşturuldu
- [ ] Health endpoint test edildi
- [ ] URL kaydedildi

**Hepsi ✅ → n8n'de kullanmaya başlayabilirsin!**

---

## 🆘 Yardım

**Sorun mu var?**
1. `RAILWAY_DEPLOY.md` → Detaylı adımlar
2. Railway logs kontrol et
3. GitHub repo'ya push edilmiş mi?

**n8n için yardım:**
- `N8N_API_REFERENCE.md` → Tüm endpoint'ler
- Input/output formatları
- Örnek workflow'lar

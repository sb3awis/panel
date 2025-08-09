# موقع API متطور - Advanced API

موقع API كامل ومتطور بـ Node.js مع Express و MongoDB يوفر خدمات متنوعة للمطورين.

## 🚀 الميزات

- **🔐 نظام توثيق كامل** - تسجيل دخول وإنشاء حسابات مع JWT
- **🎬 خدمات الأفلام** - البحث عن الأفلام والحصول على معلوماتها
- **🛠️ أدوات متنوعة** - مولد QR، اختصار الروابط، مولد كلمات المرور، وأكثر
- **⬇️ خدمات التحميل** - معلومات فيديوهات YouTube، Instagram، TikTok
- **📚 توثيق شامل** - واجهة Swagger تفاعلية
- **🛡️ الأمان** - Rate Limiting، Helmet، CORS
- **📊 إحصائيات** - تتبع استخدام المستخدمين والـ API

## 📋 المتطلبات

- Node.js (v14 أو أحدث)
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## 🔧 التثبيت

1. **استنساخ المشروع:**
```bash
git clone <repository-url>
cd api
```

2. **تثبيت المتطلبات:**
```bash
npm install
```

3. **إعداد متغيرات البيئة:**
```bash
cp .env.example .env
```
ثم قم بتعديل ملف `.env` بالقيم المناسبة.

4. **تشغيل MongoDB:**
تأكد من تشغيل MongoDB على جهازك أو استخدم MongoDB Atlas.

5. **تشغيل الخادم:**
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## 🌐 نقاط النهاية (Endpoints)

### 🔐 التوثيق (Authentication)
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/verify` - التحقق من صحة الـ Token

### 👥 المستخدمين (Users)
- `GET /api/users/profile` - ملف المستخدم الشخصي
- `GET /api/users/stats` - إحصائيات المستخدمين

### 🎬 الأفلام (Movies)
- `GET /api/movies/search?q=فيلم` - البحث عن الأفلام
- `GET /api/movies/popular` - الأفلام الشائعة
- `GET /api/movies/:id` - تفاصيل فيلم محدد

### 🛠️ الأدوات (Tools)
- `POST /api/tools/qr-generator` - إنشاء رمز QR
- `POST /api/tools/url-shortener` - اختصار الروابط
- `POST /api/tools/password-generator` - مولد كلمات المرور
- `POST /api/tools/hash-generator` - إنشاء Hash
- `POST /api/tools/base64` - تشفير/فك تشفير Base64
- `POST /api/tools/json-formatter` - تنسيق JSON

### ⬇️ التحميل (Download)
- `POST /api/download/youtube-info` - معلومات فيديو YouTube
- `POST /api/download/instagram-info` - معلومات منشور Instagram
- `POST /api/download/tiktok-info` - معلومات فيديو TikTok
- `POST /api/download/file-info` - معلومات ملف من رابط

## 📚 التوثيق التفاعلي

بعد تشغيل الخادم، يمكنك الوصول للتوثيق التفاعلي على:
```
http://localhost:3000/api-docs
```

## 🔑 استخدام الـ API

### مثال على التسجيل:
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

### مثال على استخدام الأدوات:
```javascript
const response = await fetch('http://localhost:3000/api/tools/qr-generator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello World',
    size: 300
  })
});

const data = await response.json();
console.log(data.qrCode.url);
```

## 🛡️ الأمان

- **Rate Limiting**: حد أقصى 100 طلب كل 15 دقيقة لكل IP
- **JWT Authentication**: رموز مصادقة آمنة
- **Helmet**: حماية من الثغرات الشائعة
- **CORS**: تحكم في الوصول من المصادر المختلفة
- **Input Validation**: التحقق من صحة البيانات المدخلة

## 🔧 التخصيص

### إضافة مفاتيح API خارجية:
```env
# في ملف .env
TMDB_API_KEY=your_tmdb_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### تخصيص Rate Limiting:
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 دقيقة
RATE_LIMIT_MAX_REQUESTS=100  # 100 طلب
```

## 📊 المراقبة

يمكنك مراقبة استخدام الـ API من خلال:
- إحصائيات المستخدمين: `GET /api/users/stats`
- سجلات الخادم في وحدة التحكم
- قاعدة البيانات لتتبع الاستخدام التفصيلي

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة:
- افتح Issue في GitHub
- راسلنا على: support@advancedapi.com

## 🎯 خطط المستقبل

- [ ] إضافة المزيد من أدوات المطورين
- [ ] دعم المزيد من منصات التواصل الاجتماعي
- [ ] واجهة ويب للإدارة
- [ ] API للذكاء الاصطناعي
- [ ] نظام إشعارات
- [ ] تحليلات متقدمة

---

**تم تطويره بـ ❤️ باستخدام Node.js و Express و MongoDB**

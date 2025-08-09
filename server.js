const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// إعدادات الأمان
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 دقيقة
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // حد الطلبات لكل IP
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// إعدادات Swagger للتوثيق
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Advanced API - موقع API متطور',
      version: '1.0.0',
      description: 'موقع API كامل ومتطور بـ Node.js مع Express و MongoDB يوفر خدمات متنوعة للمطورين',
      contact: {
        name: 'فريق التطوير',
        email: 'support@advancedapi.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'خادم التطوير'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Advanced API Documentation'
}));

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في موقع API المتطور',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      movies: '/api/movies',
      tools: '/api/tools',
      download: '/api/download'
    },
    features: [
      'توثيق المستخدمين',
      'إدارة الأفلام والمسلسلات',
      'أدوات متنوعة للمطورين',
      'تحميل المحتوى',
      'Rate Limiting',
      'توثيق شامل مع Swagger'
    ]
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: الصفحة الرئيسية للـ API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: معلومات عامة عن الـ API
 */

// استيراد المسارات
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const toolRoutes = require('./routes/tools');
const downloadRoutes = require('./routes/download');

// استخدام المسارات
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/download', downloadRoutes);

// معالجة الأخطاء 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'المسار غير موجود',
    message: 'Endpoint not found',
    documentation: '/api-docs'
  });
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'خطأ في الخادم',
    message: 'Internal server error'
  });
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/advanced_api')
  .then(() => {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
    console.error('❌ MongoDB connection error:', err);
  });

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 التوثيق متاح على: http://localhost:${PORT}/api-docs`);
  console.log(`📚 Documentation available at: http://localhost:${PORT}/api-docs`);
});

module.exports = app;

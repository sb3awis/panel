const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /api/tools/qr-generator:
 *   post:
 *     summary: إنشاء رمز QR
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: النص المراد تحويله لرمز QR
 *               size:
 *                 type: integer
 *                 description: حجم الرمز (افتراضي 200)
 *     responses:
 *       200:
 *         description: رمز QR تم إنشاؤه بنجاح
 */
router.post('/qr-generator', async (req, res) => {
  try {
    const { text, size = 200 } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'النص مطلوب'
      });
    }

    // استخدام API مجاني لإنشاء QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    
    res.json({
      success: true,
      message: 'تم إنشاء رمز QR بنجاح',
      qrCode: {
        url: qrUrl,
        text,
        size
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

/**
 * @swagger
 * /api/tools/url-shortener:
 *   post:
 *     summary: اختصار الروابط
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: الرابط المراد اختصاره
 *     responses:
 *       200:
 *         description: تم اختصار الرابط بنجاح
 */
router.post('/url-shortener', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'الرابط مطلوب'
      });
    }

    // التحقق من صحة الرابط
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'الرابط غير صحيح'
      });
    }

    // إنشاء رابط مختصر (محاكاة)
    const shortId = uuidv4().substring(0, 8);
    const shortUrl = `https://short.ly/${shortId}`;
    
    res.json({
      success: true,
      message: 'تم اختصار الرابط بنجاح',
      data: {
        originalUrl: url,
        shortUrl,
        shortId,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

/**
 * @swagger
 * /api/tools/password-generator:
 *   post:
 *     summary: إنشاء كلمة مرور قوية
 *     tags: [Tools]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               length:
 *                 type: integer
 *                 description: طول كلمة المرور (افتراضي 12)
 *               includeSymbols:
 *                 type: boolean
 *                 description: تضمين رموز خاصة
 *               includeNumbers:
 *                 type: boolean
 *                 description: تضمين أرقام
 *               includeUppercase:
 *                 type: boolean
 *                 description: تضمين أحرف كبيرة
 *     responses:
 *       200:
 *         description: تم إنشاء كلمة المرور بنجاح
 */
router.post('/password-generator', (req, res) => {
  try {
    const { 
      length = 12, 
      includeSymbols = true, 
      includeNumbers = true, 
      includeUppercase = true 
    } = req.body;

    let charset = 'abcdefghijklmnopqrstuvwxyz';
    
    if (includeUppercase) {
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (includeNumbers) {
      charset += '0123456789';
    }
    
    if (includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // تقييم قوة كلمة المرور
    let strength = 'ضعيف';
    if (length >= 8 && includeNumbers && includeUppercase) {
      strength = 'متوسط';
    }
    if (length >= 12 && includeNumbers && includeUppercase && includeSymbols) {
      strength = 'قوي';
    }
    if (length >= 16 && includeNumbers && includeUppercase && includeSymbols) {
      strength = 'قوي جداً';
    }

    res.json({
      success: true,
      message: 'تم إنشاء كلمة المرور بنجاح',
      data: {
        password,
        length,
        strength,
        settings: {
          includeSymbols,
          includeNumbers,
          includeUppercase
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

/**
 * @swagger
 * /api/tools/hash-generator:
 *   post:
 *     summary: إنشاء Hash للنصوص
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: النص المراد تشفيره
 *               algorithm:
 *                 type: string
 *                 enum: [md5, sha1, sha256, sha512]
 *                 description: نوع التشفير
 *     responses:
 *       200:
 *         description: تم إنشاء الـ Hash بنجاح
 */
router.post('/hash-generator', async (req, res) => {
  try {
    const { text, algorithm = 'sha256' } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'النص مطلوب'
      });
    }

    const crypto = require('crypto');
    const hash = crypto.createHash(algorithm).update(text).digest('hex');

    res.json({
      success: true,
      message: 'تم إنشاء الـ Hash بنجاح',
      data: {
        originalText: text,
        hash,
        algorithm,
        length: hash.length
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

/**
 * @swagger
 * /api/tools/base64:
 *   post:
 *     summary: تشفير وفك تشفير Base64
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - action
 *             properties:
 *               text:
 *                 type: string
 *                 description: النص المراد معالجته
 *               action:
 *                 type: string
 *                 enum: [encode, decode]
 *                 description: نوع العملية
 *     responses:
 *       200:
 *         description: تمت العملية بنجاح
 */
router.post('/base64', (req, res) => {
  try {
    const { text, action } = req.body;
    
    if (!text || !action) {
      return res.status(400).json({
        success: false,
        message: 'النص ونوع العملية مطلوبان'
      });
    }

    let result;
    let operation;

    if (action === 'encode') {
      result = Buffer.from(text, 'utf8').toString('base64');
      operation = 'تشفير';
    } else if (action === 'decode') {
      try {
        result = Buffer.from(text, 'base64').toString('utf8');
        operation = 'فك تشفير';
      } catch {
        return res.status(400).json({
          success: false,
          message: 'النص المدخل ليس Base64 صحيح'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'نوع العملية يجب أن يكون encode أو decode'
      });
    }

    res.json({
      success: true,
      message: `تم ${operation} النص بنجاح`,
      data: {
        original: text,
        result,
        action,
        operation
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

/**
 * @swagger
 * /api/tools/json-formatter:
 *   post:
 *     summary: تنسيق وتحقق من صحة JSON
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - json
 *             properties:
 *               json:
 *                 type: string
 *                 description: نص JSON المراد تنسيقه
 *               minify:
 *                 type: boolean
 *                 description: ضغط JSON (إزالة المسافات)
 *     responses:
 *       200:
 *         description: تم تنسيق JSON بنجاح
 */
router.post('/json-formatter', (req, res) => {
  try {
    const { json, minify = false } = req.body;
    
    if (!json) {
      return res.status(400).json({
        success: false,
        message: 'نص JSON مطلوب'
      });
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(json);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'JSON غير صحيح',
        error: error.message
      });
    }

    const formatted = minify ? 
      JSON.stringify(parsedJson) : 
      JSON.stringify(parsedJson, null, 2);

    // حساب إحصائيات
    const stats = {
      keys: countKeys(parsedJson),
      size: new Blob([formatted]).size,
      lines: formatted.split('\n').length,
      type: Array.isArray(parsedJson) ? 'array' : typeof parsedJson
    };

    res.json({
      success: true,
      message: 'تم تنسيق JSON بنجاح',
      data: {
        original: json,
        formatted,
        valid: true,
        minified: minify,
        stats
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// دالة مساعدة لحساب عدد المفاتيح
function countKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj)) return obj.length;
  return Object.keys(obj).length;
}

module.exports = router;

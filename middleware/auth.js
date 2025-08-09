const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // الحصول على الـ Token من Header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'لا يوجد رمز مصادقة، الوصول مرفوض'
      });
    }

    // التحقق من صحة الـ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // البحث عن المستخدم
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'رمز المصادقة غير صحيح'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب غير نشط'
      });
    }

    // تحديث آخر نشاط وإحصائيات الاستخدام
    user.apiUsage.totalRequests += 1;
    await user.resetDailyUsage();
    user.apiUsage.dailyRequests += 1;
    await user.updateLastActive();

    // إضافة معلومات المستخدم للطلب
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    console.error('خطأ في المصادقة:', error);
    res.status(401).json({
      success: false,
      message: 'رمز المصادقة غير صحيح'
    });
  }
};

// Middleware للتحقق من صلاحيات الإدارة
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'الوصول مرفوض - صلاحيات إدارة مطلوبة'
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'خطأ في التحقق من الصلاحيات'
    });
  }
};

// Middleware اختياري للمصادقة (لا يرفض الطلب إذا لم يكن هناك token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
        
        // تحديث الإحصائيات
        user.apiUsage.totalRequests += 1;
        await user.resetDailyUsage();
        user.apiUsage.dailyRequests += 1;
        await user.updateLastActive();
      }
    }
    
    next();
  } catch (error) {
    // في حالة الخطأ، نتابع بدون مصادقة
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth
};

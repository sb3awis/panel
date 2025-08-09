const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    unique: true,
    trim: true,
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    maxlength: [30, 'اسم المستخدم لا يمكن أن يزيد عن 30 حرف']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  apiUsage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    dailyRequests: {
      type: Number,
      default: 0
    },
    lastRequestDate: {
      type: Date,
      default: Date.now
    }
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    website: String,
    location: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual للاسم الكامل
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Middleware لتحديث lastActive عند كل طلب
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Middleware لإعادة تعيين العداد اليومي
userSchema.methods.resetDailyUsage = function() {
  const today = new Date();
  const lastRequest = new Date(this.apiUsage.lastRequestDate);
  
  if (today.toDateString() !== lastRequest.toDateString()) {
    this.apiUsage.dailyRequests = 0;
  }
  
  this.apiUsage.lastRequestDate = today;
  return this.save();
};

// Index للبحث السريع
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);

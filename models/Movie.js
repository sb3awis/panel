const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان الفيلم مطلوب'],
    trim: true,
    maxlength: [200, 'عنوان الفيلم لا يمكن أن يزيد عن 200 حرف']
  },
  originalTitle: {
    type: String,
    trim: true
  },
  overview: {
    type: String,
    maxlength: [2000, 'الوصف لا يمكن أن يزيد عن 2000 حرف']
  },
  releaseDate: {
    type: Date
  },
  runtime: {
    type: Number, // بالدقائق
    min: [1, 'مدة الفيلم يجب أن تكون أكبر من 0']
  },
  rating: {
    type: Number,
    min: [0, 'التقييم لا يمكن أن يكون أقل من 0'],
    max: [10, 'التقييم لا يمكن أن يكون أكبر من 10'],
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  poster: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'رابط الصورة يجب أن يكون URL صحيح'
    }
  },
  backdrop: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'رابط الخلفية يجب أن يكون URL صحيح'
    }
  },
  genres: [{
    type: String,
    trim: true
  }],
  cast: [{
    name: {
      type: String,
      required: true
    },
    character: String,
    profilePath: String
  }],
  crew: [{
    name: {
      type: String,
      required: true
    },
    job: String,
    department: String
  }],
  productionCompanies: [{
    name: String,
    country: String
  }],
  budget: {
    type: Number,
    min: [0, 'الميزانية لا يمكن أن تكون سالبة']
  },
  revenue: {
    type: Number,
    min: [0, 'الإيرادات لا يمكن أن تكون سالبة']
  },
  status: {
    type: String,
    enum: ['rumored', 'planned', 'in_production', 'post_production', 'released', 'canceled'],
    default: 'released'
  },
  language: {
    type: String,
    default: 'ar'
  },
  country: {
    type: String,
    default: 'SA'
  },
  externalIds: {
    tmdbId: Number,
    imdbId: String,
    rottenTomatoesId: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual للتقييم بالنجوم
movieSchema.virtual('starRating').get(function() {
  return Math.round(this.rating / 2); // تحويل من 10 إلى 5 نجوم
});

// Virtual لمدة الفيلم بالساعات والدقائق
movieSchema.virtual('formattedRuntime').get(function() {
  if (!this.runtime) return 'غير محدد';
  const hours = Math.floor(this.runtime / 60);
  const minutes = this.runtime % 60;
  if (hours > 0) {
    return `${hours}س ${minutes}د`;
  }
  return `${minutes}د`;
});

// Virtual للسنة
movieSchema.virtual('year').get(function() {
  return this.releaseDate ? this.releaseDate.getFullYear() : null;
});

// Index للبحث السريع
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ 'externalIds.tmdbId': 1 });

// Middleware لتحديث popularity عند التعديل
movieSchema.pre('save', function(next) {
  if (this.isModified('rating') || this.isModified('voteCount')) {
    // حساب الشعبية بناءً على التقييم وعدد الأصوات
    this.popularity = (this.rating * this.voteCount) / 100;
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);

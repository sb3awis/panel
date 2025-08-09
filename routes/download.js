const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /api/download/youtube-info:
 *   post:
 *     summary: الحصول على معلومات فيديو YouTube
 *     tags: [Download]
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
 *                 description: رابط فيديو YouTube
 *     responses:
 *       200:
 *         description: معلومات الفيديو
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 videoInfo:
 *                   type: object
 */
router.post('/youtube-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'رابط الفيديو مطلوب'
      });
    }

    // التحقق من أن الرابط من YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    
    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'رابط YouTube غير صحيح'
      });
    }

    const videoId = match[1];

    // محاكاة معلومات الفيديو (في التطبيق الحقيقي، ستحتاج لاستخدام YouTube API أو مكتبة خاصة)
    const videoInfo = {
      id: videoId,
      title: `فيديو YouTube - ${videoId}`,
      description: 'وصف الفيديو سيظهر هنا',
      duration: '5:30',
      views: '1,234,567',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      channel: 'اسم القناة',
      uploadDate: '2023-01-01',
      formats: [
        { quality: '720p', format: 'mp4', size: '50MB' },
        { quality: '480p', format: 'mp4', size: '30MB' },
        { quality: '360p', format: 'mp4', size: '20MB' }
      ]
    };

    res.json({
      success: true,
      message: 'تم الحصول على معلومات الفيديو بنجاح',
      videoInfo,
      note: 'هذه معلومات تجريبية - للحصول على معلومات حقيقية، أضف YouTube API key'
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
 * /api/download/instagram-info:
 *   post:
 *     summary: الحصول على معلومات منشور Instagram
 *     tags: [Download]
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
 *                 description: رابط منشور Instagram
 *     responses:
 *       200:
 *         description: معلومات المنشور
 */
router.post('/instagram-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'رابط المنشور مطلوب'
      });
    }

    // التحقق من أن الرابط من Instagram
    const instagramRegex = /instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(instagramRegex);
    
    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'رابط Instagram غير صحيح'
      });
    }

    const postId = match[2];
    const postType = match[1];

    // محاكاة معلومات المنشور
    const postInfo = {
      id: postId,
      type: postType === 'p' ? 'صورة' : postType === 'reel' ? 'ريل' : 'فيديو',
      caption: 'وصف المنشور سيظهر هنا...',
      username: 'اسم_المستخدم',
      likes: '1,234',
      comments: '56',
      timestamp: '2023-01-01T12:00:00Z',
      media: [
        {
          type: 'image',
          url: 'https://via.placeholder.com/400x400',
          thumbnail: 'https://via.placeholder.com/150x150'
        }
      ]
    };

    res.json({
      success: true,
      message: 'تم الحصول على معلومات المنشور بنجاح',
      postInfo,
      note: 'هذه معلومات تجريبية - للحصول على معلومات حقيقية، ستحتاج لاستخدام أدوات خاصة'
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
 * /api/download/tiktok-info:
 *   post:
 *     summary: الحصول على معلومات فيديو TikTok
 *     tags: [Download]
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
 *                 description: رابط فيديو TikTok
 *     responses:
 *       200:
 *         description: معلومات الفيديو
 */
router.post('/tiktok-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'رابط الفيديو مطلوب'
      });
    }

    // التحقق من أن الرابط من TikTok
    const tiktokRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)|vm\.tiktok\.com\/([a-zA-Z0-9]+)/;
    const match = url.match(tiktokRegex);
    
    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'رابط TikTok غير صحيح'
      });
    }

    const videoId = match[1] || match[2];

    // محاكاة معلومات الفيديو
    const videoInfo = {
      id: videoId,
      description: 'وصف فيديو TikTok...',
      username: '@اسم_المستخدم',
      likes: '12.3K',
      comments: '456',
      shares: '789',
      views: '100K',
      duration: '15s',
      music: 'اسم الأغنية - الفنان',
      thumbnail: 'https://via.placeholder.com/300x400',
      downloadUrl: 'https://example.com/download/tiktok-video.mp4'
    };

    res.json({
      success: true,
      message: 'تم الحصول على معلومات الفيديو بنجاح',
      videoInfo,
      note: 'هذه معلومات تجريبية - للحصول على معلومات حقيقية، ستحتاج لاستخدام أدوات خاصة'
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
 * /api/download/file-info:
 *   post:
 *     summary: الحصول على معلومات ملف من رابط مباشر
 *     tags: [Download]
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
 *                 description: رابط الملف المباشر
 *     responses:
 *       200:
 *         description: معلومات الملف
 */
router.post('/file-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'رابط الملف مطلوب'
      });
    }

    try {
      // طلب HEAD للحصول على معلومات الملف بدون تحميله
      const response = await axios.head(url, { timeout: 10000 });
      
      const fileInfo = {
        url,
        filename: extractFilename(url),
        size: response.headers['content-length'] ? 
          formatFileSize(parseInt(response.headers['content-length'])) : 'غير محدد',
        type: response.headers['content-type'] || 'غير محدد',
        lastModified: response.headers['last-modified'] || 'غير محدد',
        server: response.headers['server'] || 'غير محدد',
        downloadId: uuidv4()
      };

      res.json({
        success: true,
        message: 'تم الحصول على معلومات الملف بنجاح',
        fileInfo
      });

    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return res.status(400).json({
          success: false,
          message: 'لا يمكن الوصول للرابط المحدد'
        });
      }
      
      throw error;
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// دوال مساعدة
function extractFilename(url) {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop();
    return filename || 'ملف_غير_محدد';
  } catch {
    return 'ملف_غير_محدد';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = router;

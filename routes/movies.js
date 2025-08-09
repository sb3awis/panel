const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         overview:
 *           type: string
 *         releaseDate:
 *           type: string
 *         rating:
 *           type: number
 *         poster:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: البحث عن الأفلام
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: كلمة البحث
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: رقم الصفحة
 *     responses:
 *       200:
 *         description: نتائج البحث
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 totalResults:
 *                   type: number
 *                 page:
 *                   type: number
 */
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'كلمة البحث مطلوبة'
      });
    }

    // البحث في قاعدة البيانات المحلية أولاً
    const localMovies = await Movie.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { overview: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    // إذا كان لديك TMDB API key، يمكنك البحث في TMDB أيضاً
    let externalMovies = [];
    if (process.env.TMDB_API_KEY) {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: {
            api_key: process.env.TMDB_API_KEY,
            query: q,
            page,
            language: 'ar'
          }
        });
        
        externalMovies = response.data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          source: 'tmdb'
        }));
      } catch (error) {
        console.error('خطأ في TMDB API:', error.message);
      }
    }

    // دمج النتائج
    const allMovies = [...localMovies, ...externalMovies];

    res.json({
      success: true,
      movies: allMovies,
      totalResults: allMovies.length,
      page: parseInt(page),
      message: localMovies.length > 0 ? 'تم العثور على نتائج محلية وخارجية' : 'نتائج من قواعد البيانات الخارجية'
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
 * /api/movies/popular:
 *   get:
 *     summary: الأفلام الشائعة
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: رقم الصفحة
 *     responses:
 *       200:
 *         description: قائمة الأفلام الشائعة
 */
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    // أفلام شائعة افتراضية
    const defaultMovies = [
      {
        id: 'default_1',
        title: 'فيلم تجريبي 1',
        overview: 'هذا فيلم تجريبي لعرض وظائف الـ API',
        releaseDate: '2023-01-01',
        rating: 8.5,
        poster: null,
        genres: ['دراما', 'أكشن']
      },
      {
        id: 'default_2',
        title: 'فيلم تجريبي 2',
        overview: 'فيلم آخر لاختبار النظام',
        releaseDate: '2023-06-15',
        rating: 7.8,
        poster: null,
        genres: ['كوميديا', 'رومانسي']
      }
    ];

    let movies = defaultMovies;

    // إذا كان لديك TMDB API key
    if (process.env.TMDB_API_KEY) {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
          params: {
            api_key: process.env.TMDB_API_KEY,
            page,
            language: 'ar'
          }
        });
        
        movies = response.data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          genres: []
        }));
      } catch (error) {
        console.error('خطأ في TMDB API:', error.message);
      }
    }

    res.json({
      success: true,
      movies,
      page: parseInt(page),
      message: process.env.TMDB_API_KEY ? 'أفلام من TMDB' : 'أفلام تجريبية - أضف TMDB_API_KEY للحصول على بيانات حقيقية'
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
 * /api/movies/{id}:
 *   get:
 *     summary: الحصول على تفاصيل فيلم محدد
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الفيلم
 *     responses:
 *       200:
 *         description: تفاصيل الفيلم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // البحث في قاعدة البيانات المحلية أولاً
    let movie = await Movie.findById(id);
    
    // إذا لم نجد الفيلم محلياً وكان لديك TMDB API key
    if (!movie && process.env.TMDB_API_KEY && !isNaN(id)) {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: 'ar'
          }
        });
        
        movie = {
          id: response.data.id,
          title: response.data.title,
          overview: response.data.overview,
          releaseDate: response.data.release_date,
          rating: response.data.vote_average,
          poster: response.data.poster_path ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}` : null,
          genres: response.data.genres ? response.data.genres.map(g => g.name) : [],
          runtime: response.data.runtime,
          budget: response.data.budget,
          revenue: response.data.revenue
        };
      } catch (error) {
        console.error('خطأ في TMDB API:', error.message);
      }
    }
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'الفيلم غير موجود'
      });
    }

    res.json({
      success: true,
      movie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

module.exports = router;

const express = require('express')
const router = require('express').Router()
//const { ForumPost, Comment, Like } = require('../models/forum/forumIndex')
const { User, ForumPost, Comment, Like } = require('../models/zzz_index')
const tokenSessionExtractor = require('../customMW/tokenSessionExtractor')


router.post('/posts', tokenSessionExtractor, async (req, res) => {
  try {
    const { content } = req.body
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    const userId = req.user.id

    // Luodaan ensin postaus
    const newPost = await ForumPost.create({
      userId: userId,
      content: content
    })

    // Haetaan juuri luotu postaus vain User-relaatiolla
    const postWithRelations = await ForumPost.findByPk(newPost.id, {
      include: [
        {
          model: Comment,
          as: 'comments', // Vastaa ForumPost.hasMany(Comment, { as: 'comments' })
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user', // Vastaa Comment.belongsTo(User, { as: 'user' })
              attributes: ['username']
            }
          ]
        },
        {
          model: Like,
          as: 'likes', // Vastaa ForumPost.hasMany(Like, { as: 'likes' })
          attributes: ['id', 'userId']
        },
        {
          model: User,
          as: 'author', // Vastaa ForumPost.belongsTo(User, { as: 'user' })
          attributes: ['username']
        }
      ]
    });
    
    res.status(201).json(postWithRelations);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Something went wrong..' });
  }
});


router.get('/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  try {
    const posts = await ForumPost.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username']
            }
          ]
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id', 'userId']
        },
        {
          model: User,
          as: 'author',
          attributes: ['username']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    // Debug-tulostus
    console.log('Ensimmäinen postaus:', JSON.stringify(posts.rows[0], null, 2))

    if (!posts || !posts.rows || posts.rows.length === 0) {
      console.log('Ei postauksia löytynyt')
      return res.json({
        posts: [],
        totalPosts: 0,
        limit: limit,
        offset: offset,
      })
    }

    res.json({
      posts: posts.rows,
      totalPosts: posts.count,
      limit: limit,
      offset: offset,
    })
  } catch (error) {
    console.error('Virhe postausten haussa:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT tai POST /posts/:id/like
router.put('/posts/:id/like', tokenSessionExtractor, async (req, res) => {
  try {
    const postId = parseInt(req.params.id)
    const userId = req.user.id
 
    // Tarkista onko postaus olemassa
    const post = await ForumPost.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
 
    // Etsi olemassaoleva tykkäys
    const existingLike = await Like.findOne({
      where: {
        postId: postId,
        userId: userId
      }
    })
 
    if (existingLike) {
      // Jos tykkäys löytyy, poistetaan se
      await existingLike.destroy()
      // Haetaan päivitetty postaus relaatioineen
      const updatedPost = await ForumPost.findByPk(postId, {
        include: [
          {
            model: Comment,
            as: 'comments',
            attributes: ['id', 'content', 'createdAt'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['username']
              }
            ]
          },
          {
            model: Like,
            as: 'likes',
            attributes: ['id', 'userId']
          },
          {
            model: User,
            as: 'author',
            attributes: ['username']
          }
        ]
      })
      return res.json(updatedPost)
    }
 
    // Jos tykkäystä ei löytynyt, luodaan uusi
    await Like.create({
      postId: postId,
      userId: userId
    })
 
    // Haetaan päivitetty postaus relaatioineen
    const updatedPost = await ForumPost.findByPk(postId, {
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username']
            }
          ]
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id', 'userId']
        },
        {
          model: User,
          as: 'author',
          attributes: ['username']
        }
      ]
    })
 
    res.json(updatedPost)
 
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Something went wrong with like operation' })
  }
 })

 router.post('/posts/:id/comments', tokenSessionExtractor, async (req, res) => {
  try {
    const postId = parseInt(req.params.id)
    const userId = req.user.id
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: 'Content is required' })
    }

    // Tarkista onko postaus olemassa
    const post = await ForumPost.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Luo uusi kommentti
    await Comment.create({
      postId,
      userId,
      content
    })

    // Hae päivitetty postaus kaikkine tietoineen
    const updatedPost = await ForumPost.findByPk(postId, {
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username']
            }
          ]
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id', 'userId']
        },
        {
          model: User,
          as: 'author',
          attributes: ['username']
        }
      ]
    })

    res.status(201).json(updatedPost)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

router.delete('/posts/:id', tokenSessionExtractor, async (req, res) => {
  try {
    const postId = parseInt(req.params.id)
    const userId = req.user.id

    const post = await ForumPost.findByPk(postId)
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' })
    }

    await post.destroy()

    res.status(204).end()
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

module.exports = router
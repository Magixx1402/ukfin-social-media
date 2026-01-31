import express from 'express';
import { postOperations } from '../database';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createPostSchema = z.object({
  content_type: z.enum(['photo', 'video', 'text']),
  content: z.string().min(1, 'Content is required'),
  caption: z.string().min(1, 'Caption is required'),
  filter_tags: z.string().optional(),
  location: z.string().optional(),
});

const updatePostSchema = z.object({
  caption: z.string().optional(),
  likes: z.number().int().min(0).optional(),
  comments: z.number().int().min(0).optional(),
  reposts: z.number().int().min(0).optional(),
  filter_tags: z.string().optional(),
  location: z.string().optional(),
});

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/posts called');
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    let posts = await postOperations.getAll(limit);
    
    // If no posts exist, add sample data
    if (posts.length === 0) {
      console.log('No posts found, adding sample data...');
      
      const samplePosts = [
        {
          user_id: 1,
          username: 'tech_enthusiast',
          display_name: 'Alex Chen',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          content_type: 'photo' as const,
          content: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop',
          caption: 'Database integration working! 🚀 Posts now persist across server restarts #database #api #success',
          likes: 2847,
          comments: 156,
          reposts: 45,
          filter_tags: JSON.stringify(['database', 'api', 'success']),
          location: 'Database City'
        },
        {
          user_id: 2,
          username: 'webdev_chen',
          display_name: 'Maya Chen',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          content_type: 'text' as const,
          content: 'This is a text post stored in the database! ✨ Backend API fully functional #database #persistent',
          caption: 'Text posts are now database-driven! #database #persistent #working',
          likes: 1523,
          comments: 89,
          reposts: 23,
          filter_tags: JSON.stringify(['database', 'persistent', 'working']),
          location: 'Persistent Storage'
        }
      ];
      
      for (const postData of samplePosts) {
        try {
          const newPost = await postOperations.create(postData);
          console.log(`Created sample post: ${newPost.id}`);
        } catch (err) {
          console.error('Error creating sample post:', err);
        }
      }
      
      // Get posts again after adding samples
      posts = await postOperations.getAll(limit);
    }
    
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:id - Get specific post
router.get('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await postOperations.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// GET /api/posts/user/:userId - Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const posts = await postOperations.getByUser(userId, limit);
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// POST /api/posts - Create new post
router.post('/', async (req, res) => {
  try {
    // For now, we'll use a default user. In a real app, this would come from JWT auth
    const userId = 1;
    
    const validatedData = createPostSchema.parse(req.body);
    
    // Get user info (for now, use placeholder data)
    const userData = {
      username: 'current_user',
      display_name: 'Current User',
      avatar_url: 'https://example.com/avatars/default.jpg'
    };

    const newPost = await postOperations.create({
      user_id: userId,
      username: userData.username,
      display_name: userData.display_name,
      avatar_url: userData.avatar_url,
      ...validatedData,
      likes: 0,
      comments: 0,
      reposts: 0,
      filter_tags: validatedData.filter_tags || '',
      location: validatedData.location || ''
    });

    res.status(201).json({ post: newPost });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const validatedData = updatePostSchema.parse(req.body);
    
    const updatedPost = await postOperations.update(postId, validatedData);
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: updatedPost });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const deleted = await postOperations.delete(postId);
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/:id/like - Like/unlike post
router.post('/:id/like', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const { increment = true } = req.body;
    
    const updatedPost = await postOperations.toggleLike(postId, increment);
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: updatedPost });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export default router;
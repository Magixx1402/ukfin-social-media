import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface DatabasePost {
  id: number;
  user_id: number;
  username: string;
  display_name: string;
  avatar_url: string;
  content_type: 'photo' | 'video' | 'text';
  content: string;
  caption: string;
  likes: number;
  comments: number;
  reposts: number;
  filter_tags: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  type: 'photo' | 'video' | 'text';
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  image?: string;
  video?: string;
  text?: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  tags: string[];
  location?: string;
}

// Transform database post to frontend format
const transformPost = (dbPost: DatabasePost): Post => ({
  id: dbPost.id,
  type: dbPost.content_type,
  author: {
    name: dbPost.display_name,
    avatar: dbPost.avatar_url,
  },
  image: dbPost.content_type === 'photo' ? dbPost.content : undefined,
  video: dbPost.content_type === 'video' ? dbPost.content : undefined,
  text: dbPost.content_type === 'text' ? dbPost.content : undefined,
  caption: dbPost.caption,
  likes: dbPost.likes,
  comments: dbPost.comments,
  timeAgo: new Date(dbPost.created_at).toLocaleString(),
  tags: dbPost.filter_tags ? JSON.parse(dbPost.filter_tags) : [],
  location: dbPost.location || undefined,
});

export const usePosts = (limit?: number) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getPosts(limit);
      const transformedPosts = response.posts.map(transformPost);
      setPosts(transformedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    content_type: 'photo' | 'video' | 'text';
    content: string;
    caption: string;
    filter_tags?: string;
    location?: string;
  }) => {
    try {
      const response = await apiClient.createPost(postData);
      const newPost = transformPost(response.post);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      const response = await apiClient.toggleLike(postId);
      const updatedPost = transformPost(response.post);
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? updatedPost : post
        )
      );
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
      throw err;
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await apiClient.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    createPost,
    toggleLike,
    deletePost,
  };
};

export default usePosts;
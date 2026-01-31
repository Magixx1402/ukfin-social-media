import fs from 'fs';
import path from 'path';
import { initializeDatabase, postOperations } from '../database';

interface JsonPost {
  id: string;
  type: 'photo' | 'video' | 'text';
  username: string;
  display_name: string;
  avatar_url: string;
  timestamp: string;
  caption: string;
  image_url?: string;
  video_url?: string;
  text_content?: string;
  alt_text?: string;
  location?: string;
  likes: number;
  comments: number;
  reposts: number;
  filter_tags?: string[];
}

const migratePosts = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized');

    // Read posts.json file
    const postsPath = path.join(__dirname, '../../posts.json');
    const rawData = fs.readFileSync(postsPath, 'utf8');
    const data = JSON.parse(rawData);

    // Convert and insert posts
    const allPosts = [
      ...(data.photos || []).map((post: JsonPost) => ({
        ...post,
        content_type: 'photo' as const,
        content: post.image_url || '',
        filter_tags: post.filter_tags ? JSON.stringify(post.filter_tags) : '',
        user_id: 1 // Default user ID for now
      })),
      ...(data.videos || []).map((post: JsonPost) => ({
        ...post,
        content_type: 'video' as const,
        content: post.video_url || '',
        filter_tags: post.filter_tags ? JSON.stringify(post.filter_tags) : '',
        user_id: 1
      })),
      ...(data.texts || []).map((post: JsonPost) => ({
        ...post,
        content_type: 'text' as const,
        content: post.text_content || '',
        filter_tags: post.filter_tags ? JSON.stringify(post.filter_tags) : '',
        user_id: 1
      }))
    ];

    console.log(`Found ${allPosts.length} posts to migrate`);

    // Insert posts into database
    for (const post of allPosts) {
      try {
        const newPost = await postOperations.create({
          user_id: post.user_id,
          username: post.username,
          display_name: post.display_name,
          avatar_url: post.avatar_url,
          content_type: post.content_type,
          content: post.content,
          caption: post.caption,
          likes: post.likes,
          comments: post.comments,
          reposts: post.reposts,
          filter_tags: post.filter_tags,
          location: post.location || '',
          created_at: post.timestamp,
          updated_at: post.timestamp
        });
        console.log(`Migrated post: ${newPost.id} (${post.content_type})`);
      } catch (error) {
        console.error(`Error migrating post ${post.id}:`, error);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePosts();
}

export default migratePosts;
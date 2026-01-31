import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const DB_PATH = './database.sqlite';

// Create database connection
const db = new sqlite3.Database(DB_PATH);

// Promisify database methods for async/await usage
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  username: string;
  display_name: string;
  avatar_url: string;
  content_type: 'photo' | 'video' | 'text';
  content: string; // image_url, video_url, or text content
  caption: string;
  likes: number;
  comments: number;
  reposts: number;
  filter_tags: string;
  location: string;
  created_at: string;
  updated_at: string;
}

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Create users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create posts table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        content_type TEXT NOT NULL CHECK(content_type IN ('photo', 'video', 'text')),
        content TEXT NOT NULL,
        caption TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        reposts INTEGER DEFAULT 0,
        filter_tags TEXT,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// User operations
export const userOperations = {
  // Create new user
  create: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (username, email, password_hash, display_name, avatar_url)
        VALUES (?, ?, ?, ?, ?)
      `, [userData.username, userData.email, userData.password_hash, userData.display_name, userData.avatar_url], 
      function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the inserted row
          db.get('SELECT * FROM users WHERE rowid = ?', [this.lastID], function(err, row) {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  },

  // Find user by username or email
  findByUsernameOrEmail: async (username: string, email: string): Promise<User | null> => {
    const user = await dbGet(`
      SELECT * FROM users 
      WHERE username = ? OR email = ?
    `, [username, email]);
    return user || null;
  },

  // Find user by username
  findByUsername: async (username: string): Promise<User | null> => {
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    return user || null;
  },

  // Find user by email
  findByEmail: async (email: string): Promise<User | null> => {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  },

  // Find user by ID
  findById: async (id: number): Promise<User | null> => {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    return user || null;
  }
};

// Post operations
export const postOperations = {
  // Create new post
  create: async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> => {
    const result = await dbRun(`
      INSERT INTO posts (
        user_id, username, display_name, avatar_url, content_type, content, 
        caption, likes, comments, reposts, filter_tags, location
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      postData.user_id, postData.username, postData.display_name, postData.avatar_url,
      postData.content_type, postData.content, postData.caption, postData.likes,
      postData.comments, postData.reposts, postData.filter_tags, postData.location
    ]);

    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [result.lastID]);
    return post;
  },

  // Get all posts (sorted by most recent)
  getAll: async (limit?: number): Promise<Post[]> => {
    const limitClause = limit ? `LIMIT ${limit}` : '';
    const posts = await dbAll(`
      SELECT * FROM posts 
      ORDER BY created_at DESC 
      ${limitClause}
    `);
    return posts;
  },

  // Get post by ID
  findById: async (id: number): Promise<Post | null> => {
    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    return post || null;
  },

  // Get posts by user
  getByUser: async (userId: number, limit?: number): Promise<Post[]> => {
    const limitClause = limit ? `LIMIT ${limit}` : '';
    const posts = await dbAll(`
      SELECT * FROM posts 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      ${limitClause}
    `, [userId]);
    return posts;
  },

  // Update post
  update: async (id: number, updates: Partial<Omit<Post, 'id' | 'created_at' | 'user_id' | 'username' | 'display_name' | 'avatar_url'>>): Promise<Post | null> => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return null;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    await dbRun(`
      UPDATE posts 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [...values, id]);

    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    return post || null;
  },

  // Delete post
  delete: async (id: number): Promise<boolean> => {
    const result = await dbRun('DELETE FROM posts WHERE id = ?', [id]);
    return result.changes > 0;
  },

  // Like/Unlike post
  toggleLike: async (id: number, increment: boolean): Promise<Post | null> => {
    const change = increment ? 1 : -1;
    await dbRun(`
      UPDATE posts 
      SET likes = likes + ? 
      WHERE id = ?
    `, [change, id]);

    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    return post || null;
  }
};

// Close database connection
export const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
};

// Export db for advanced queries
export { db };
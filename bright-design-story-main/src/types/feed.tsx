// types/feed.ts
export interface FeedFilter {
  id: string;
  name: string;
  description: string;
  creator: string;
  isDefault: boolean;
  isPublic: boolean;
  keywords: string[];
  tags: string[];
  locations: string[];
  maxCreators: number;
  postTypes: ('photo' | 'video' | 'text')[];
  minLikes?: number;
  createdAt: Date;
  usageCount: number;
}

export interface Post {
  id: number;
  type: 'photo' | 'video' | 'text';
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  image?: string;
  videoUrl?: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  tags?: string[];
  location?: string;
}
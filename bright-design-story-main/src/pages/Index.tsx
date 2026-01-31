import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { StoriesRow } from "@/components/feed/StoriesRow";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { PostCard } from "@/components/feed/PostCard";
import { EventsSection } from "@/components/feed/EventsSection";

const posts = [
  {
    id: 1,
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop",
    caption: "Exploring new horizons 🌅 The journey never stops. #adventure #travel",
    likes: 2847,
    comments: 156,
    timeAgo: "2h ago",
  },
  {
    id: 2,
    author: {
      name: "Maya Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      verified: false,
    },
    image: "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?w=600&h=600&fit=crop",
    caption: "Coffee and creativity ☕ Best combo for a productive morning",
    likes: 1523,
    comments: 89,
    timeAgo: "4h ago",
  },
  {
    id: 3,
    author: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=600&fit=crop",
    caption: "City lights and late nights 🌃 #cityscape #nightphotography",
    likes: 4201,
    comments: 234,
    timeAgo: "6h ago",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto">
        <StoriesRow />
        <FeedTabs />
        
        <div className="divide-y divide-border">
          {/* First post */}
          <div className="p-4">
            <PostCard {...posts[0]} />
          </div>
          
          {/* Events section */}
          <EventsSection />
          
          {/* More posts */}
          {posts.slice(1).map((post) => (
            <div key={post.id} className="p-4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;

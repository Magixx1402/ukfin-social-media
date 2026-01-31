// Index.tsx
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { StoriesRow } from "@/components/feed/StoriesRow";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { FeedFilterPicker } from "@/components/feed/FeedFilterPicker";
import { FeedFilterCreator } from "@/components/feed/FeedFilterCreator";
import { PostCard } from "@/components/feed/PostCard";
import { EventsSection } from "@/components/feed/EventsSection";
import { useState, useEffect } from "react";
import { FeedFilter, Post } from "@/types/feed";
import { usePosts } from "@/hooks/usePosts";

// Posts are now fetched from the database using usePosts hook

const Index = () => {
  const { posts, loading, error, refetch } = usePosts();
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState<FeedFilter | null>(null);
  const [showFilterCreator, setShowFilterCreator] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [userFilters, setUserFilters] = useState<FeedFilter[]>([]);

  // Load last used filter and user filters from localStorage
  useEffect(() => {
    const savedFilterId = localStorage.getItem("lastUsedFilter");
    const savedUserFilters = localStorage.getItem("userFeedFilters");
    
    if (savedUserFilters) {
      try {
        const parsedFilters = JSON.parse(savedUserFilters);
        setUserFilters(parsedFilters);
        
        // If we have a saved filter ID, find it in user filters
        if (savedFilterId) {
          const savedFilter = parsedFilters.find((f: FeedFilter) => f.id === savedFilterId);
          if (savedFilter) {
            setActiveFilter(savedFilter);
          }
        }
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    }
  }, []);

// Apply filters whenever activeTab, activeFilter, or posts change
  useEffect(() => {
    let result = [...posts];

    // First apply type filter from tabs
    if (activeTab !== "all") {
      const postTypeMap: Record<string, Post['type']> = {
        'photos': 'photo',
        'videos': 'video',
        'text': 'text'
      };
      const targetType = postTypeMap[activeTab];
      result = result.filter(post => post.type === targetType);
    }

    // Then apply feed filter if active
    if (activeFilter) {
      result = result.filter(post => {
        // Filter by post types
        if (!activeFilter.postTypes.includes(post.type)) return false;

        // Filter by keywords in caption
        if (activeFilter.keywords.length > 0) {
          const hasKeyword = activeFilter.keywords.some(keyword => 
            post.caption.toLowerCase().includes(keyword.toLowerCase())
          );
          if (!hasKeyword) return false;
        }

        // Filter by tags
        if (activeFilter.tags.length > 0 && post.tags) {
          const hasTag = activeFilter.tags.some(tag => 
            post.tags?.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
          );
          if (!hasTag) return false;
        }

        // Filter by location
        if (activeFilter.locations.length > 0 && post.location) {
          const hasLocation = activeFilter.locations.some(location => 
            post.location?.toLowerCase().includes(location.toLowerCase())
          );
          if (!hasLocation) return false;
        }

        // Filter by minimum likes
        if (activeFilter.minLikes && post.likes < activeFilter.minLikes) {
          return false;
        }

        return true;
      });

      // Limit by max creators (simplified - in real app you'd track unique authors)
      const uniqueCreators = new Set(result.map(post => post.author.name));
      if (uniqueCreators.size > activeFilter.maxCreators) {
        // Take first N unique creators
        const creatorMap = new Map();
        result = result.filter(post => {
          if (!creatorMap.has(post.author.name)) {
            if (creatorMap.size < activeFilter.maxCreators) {
              creatorMap.set(post.author.name, true);
              return true;
            }
            return false;
          }
          return true;
        });
      }
    }

    setFilteredPosts(result);
  }, [activeTab, activeFilter]);

  const handleSaveFilter = (filter: FeedFilter) => {
    // Update usage count
    const updatedFilter = {
      ...filter,
      usageCount: filter.usageCount + 1
    };

    // Check if this is a new filter or existing one
    const isNewFilter = !userFilters.some(f => f.id === filter.id);
    
    let updatedUserFilters;
    if (isNewFilter) {
      updatedUserFilters = [...userFilters, updatedFilter];
    } else {
      updatedUserFilters = userFilters.map(f => 
        f.id === filter.id ? updatedFilter : f
      );
    }

    setUserFilters(updatedUserFilters);
    setActiveFilter(updatedFilter);
    
    // Save to localStorage
    localStorage.setItem("lastUsedFilter", filter.id);
    localStorage.setItem("userFeedFilters", JSON.stringify(updatedUserFilters));
    
    // Show success message
    console.log("Filter saved:", updatedFilter);
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    localStorage.removeItem("lastUsedFilter");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto">
        <StoriesRow />
        
        {/* Feed Filter Picker */}
        <FeedFilterPicker 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onCreateNewFilter={() => setShowFilterCreator(true)}
        />
        
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Filter info badge */}
        {activeFilter && (
          <div className="px-4 py-3 bg-primary/5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activeFilter.name}</span>
                  <span className="text-xs text-muted-foreground">
                    • {activeFilter.usageCount} {activeFilter.usageCount === 1 ? 'use' : 'uses'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {activeFilter.description}
                </div>
              </div>
              <button
                onClick={handleClearFilter}
                className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                Clear
              </button>
            </div>
            
            {/* Filter chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeFilter.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {keyword}
                </span>
              ))}
              {activeFilter.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                  #{tag}
                </span>
              ))}
              {activeFilter.locations.slice(0, 2).map((location, index) => (
                <span key={index} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                  {location}
                </span>
              ))}
              {activeFilter.minLikes && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                  {activeFilter.minLikes}+ likes
                </span>
              )}
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                {activeFilter.maxCreators} creators max
              </span>
            </div>
          </div>
        )}
        
<div className="divide-y divide-border">
          {/* Loading state */}
          {loading && (
            <div className="p-8 text-center">
              <div className="text-2xl mb-2">⏳</div>
              <h3 className="font-medium mb-1">Loading posts...</h3>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="p-8 text-center">
              <div className="text-2xl mb-2">❌</div>
              <h3 className="font-medium mb-1">Error loading posts</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* No posts message */}
          {!loading && !error && filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-2xl mb-2">📭</div>
              <h3 className="font-medium mb-1">No posts found</h3>
              <p className="text-sm text-muted-foreground">
                Try changing your filter settings or select a different feed filter
              </p>
              {activeFilter && (
                <button
                  onClick={handleClearFilter}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            // Render filtered posts
            !loading && !error && filteredPosts.map((post, index) => {
              // Check if we need to insert EventsSection
              const shouldShowEvents = !activeFilter && activeTab === "all" && index === 1;
              
              return (
                <div key={post.id}>
                  <div className="p-4">
                    <PostCard {...post} />
                  </div>
                  
                  {/* Show EventsSection after 2nd post in "All" tab with no filter */}
                  {shouldShowEvents && <EventsSection />}
                </div>
              );
            })
          )}
        </div>
      </main>
      
      <BottomNav />
      
      {/* Feed Filter Creator Modal */}
      {showFilterCreator && (
        <FeedFilterCreator
          onSave={handleSaveFilter}
          onClose={() => setShowFilterCreator(false)}
        />
      )}
    </div>
  );
};

export default Index;
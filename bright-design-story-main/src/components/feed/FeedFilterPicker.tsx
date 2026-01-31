// components/feed/FeedFilterPicker.tsx
import { useState } from "react";
import { ChevronDown, Plus, Star, Users, Globe, Hash, MapPin, Filter, X } from "lucide-react";
import { FeedFilter } from "@/types/feed";

const defaultFilters: FeedFilter[] = [
  {
    id: "trending",
    name: "🔥 Trending Now",
    description: "Most popular posts from across the platform",
    creator: "System",
    isDefault: true,
    isPublic: true,
    keywords: [],
    tags: ["trending", "popular"],
    locations: [],
    maxCreators: 50,
    postTypes: ["photo", "video", "text"],
    minLikes: 100,
    createdAt: new Date(),
    usageCount: 12500
  },
  {
    id: "tech",
    name: "💻 Tech & Innovation",
    description: "Latest in tech, startups, and innovation",
    creator: "System",
    isDefault: true,
    isPublic: true,
    keywords: ["tech", "innovation", "startup", "coding"],
    tags: ["technology", "programming", "ai", "gadgets"],
    locations: ["San Francisco", "Silicon Valley", "Remote"],
    maxCreators: 30,
    postTypes: ["photo", "video", "text"],
    createdAt: new Date(),
    usageCount: 8400
  },
  {
    id: "travel",
    name: "✈️ Travel Adventures",
    description: "Explore the world through amazing travel content",
    creator: "System",
    isDefault: true,
    isPublic: true,
    keywords: ["travel", "adventure", "explore", "wanderlust"],
    tags: ["travel", "nature", "landscape", "culture"],
    locations: [],
    maxCreators: 40,
    postTypes: ["photo", "video"],
    createdAt: new Date(),
    usageCount: 9200
  },
  {
    id: "creative",
    name: "🎨 Creative Minds",
    description: "Art, design, photography, and creative work",
    creator: "System",
    isDefault: true,
    isPublic: true,
    keywords: ["art", "design", "creative", "photography"],
    tags: ["art", "design", "photography", "creative"],
    locations: [],
    maxCreators: 25,
    postTypes: ["photo", "video"],
    minLikes: 50,
    createdAt: new Date(),
    usageCount: 6700
  },
  {
    id: "business",
    name: "💼 Business & Finance",
    description: "Entrepreneurship, finance, and career growth",
    creator: "System",
    isDefault: true,
    isPublic: true,
    keywords: ["business", "finance", "entrepreneur", "career"],
    tags: ["business", "finance", "entrepreneurship"],
    locations: [],
    maxCreators: 35,
    postTypes: ["text", "photo"],
    createdAt: new Date(),
    usageCount: 5800
  }
];

interface FeedFilterPickerProps {
  activeFilter: FeedFilter | null;
  onFilterChange: (filter: FeedFilter | null) => void;
  onCreateNewFilter: () => void;
}

export const FeedFilterPicker = ({ 
  activeFilter, 
  onFilterChange, 
  onCreateNewFilter 
}: FeedFilterPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userFilters, setUserFilters] = useState<FeedFilter[]>([
    {
      id: "my-tech",
      name: "🚀 My Tech Feed",
      description: "Personalized tech content",
      creator: "You",
      isDefault: false,
      isPublic: false,
      keywords: ["react", "typescript", "webdev"],
      tags: ["react", "javascript", "frontend"],
      locations: [],
      maxCreators: 20,
      postTypes: ["text", "video"],
      createdAt: new Date(),
      usageCount: 42
    }
  ]);

  const allFilters = [...defaultFilters, ...userFilters];

  const handleFilterSelect = (filter: FeedFilter) => {
    onFilterChange(filter);
    setIsOpen(false);
    
    // Save to localStorage for persistence
    localStorage.setItem("lastUsedFilter", filter.id);
  };

  const handleClearFilter = () => {
    onFilterChange(null);
    setIsOpen(false);
    localStorage.removeItem("lastUsedFilter");
  };

  return (
    <div className="relative">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Feed Filter</span>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            {activeFilter ? (
              <>
                <span className="text-sm font-medium">{activeFilter.name}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{activeFilter.usageCount.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <span className="text-sm">All Posts</span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {activeFilter && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeFilter.keywords.map((keyword, index) => (
              <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {keyword}
              </span>
            ))}
            {activeFilter.tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                #{tag}
              </span>
            ))}
            {activeFilter.locations.map((location, index) => (
              <span key={index} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                {location}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 mx-4 bg-background border border-border rounded-xl shadow-lg max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Feed Filters</h3>
              <button
                onClick={handleClearFilter}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear filter
              </button>
            </div>
            <button
              onClick={() => {
                onCreateNewFilter();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create Custom Filter</span>
            </button>
          </div>

          <div className="p-3">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Your Filters</span>
              </div>
              <div className="space-y-2">
                {userFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterSelect(filter)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeFilter?.id === filter.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{filter.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{filter.description}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {filter.usageCount} uses
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Default Filters</span>
              </div>
              <div className="space-y-2">
                {defaultFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterSelect(filter)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeFilter?.id === filter.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{filter.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{filter.description}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-muted-foreground">
                          {filter.usageCount.toLocaleString()} uses
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          By {filter.creator}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filter.postTypes.map((type) => (
                        <span key={type} className="px-1.5 py-0.5 bg-muted text-xs rounded">
                          {type}
                        </span>
                      ))}
                      {filter.minLikes && (
                        <span className="px-1.5 py-0.5 bg-muted text-xs rounded">
                          {filter.minLikes}+ likes
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
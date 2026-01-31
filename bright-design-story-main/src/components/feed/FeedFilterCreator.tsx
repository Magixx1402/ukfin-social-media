// components/feed/FeedFilterCreator.tsx
import { useState } from "react";
import { X, Save, Globe, Lock, Hash, MapPin, Users, Image, Video, FileText } from "lucide-react";
import { FeedFilter } from "@/types/feed";

interface FeedFilterCreatorProps {
  onSave: (filter: FeedFilter) => void;
  onClose: () => void;
}

export const FeedFilterCreator = ({ onSave, onClose }: FeedFilterCreatorProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
    keywords: [] as string[],
    currentKeyword: "",
    tags: [] as string[],
    currentTag: "",
    locations: [] as string[],
    currentLocation: "",
    maxCreators: 20,
    postTypes: ["photo", "video", "text"] as ('photo' | 'video' | 'text')[],
    minLikes: 0,
  });

  const addKeyword = () => {
    if (formData.currentKeyword.trim() && !formData.keywords.includes(formData.currentKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, formData.currentKeyword.trim()],
        currentKeyword: ""
      });
    }
  };

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag.trim()],
        currentTag: ""
      });
    }
  };

  const addLocation = () => {
    if (formData.currentLocation.trim() && !formData.locations.includes(formData.currentLocation.trim())) {
      setFormData({
        ...formData,
        locations: [...formData.locations, formData.currentLocation.trim()],
        currentLocation: ""
      });
    }
  };

  const removeItem = (type: 'keywords' | 'tags' | 'locations', item: string) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter(i => i !== item)
    });
  };

  const togglePostType = (type: 'photo' | 'video' | 'text') => {
    setFormData({
      ...formData,
      postTypes: formData.postTypes.includes(type)
        ? formData.postTypes.filter(t => t !== type)
        : [...formData.postTypes, type]
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    const newFilter: FeedFilter = {
      id: `filter-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      creator: "You",
      isDefault: false,
      isPublic: formData.isPublic,
      keywords: formData.keywords,
      tags: formData.tags,
      locations: formData.locations,
      maxCreators: formData.maxCreators,
      postTypes: formData.postTypes,
      minLikes: formData.minLikes || undefined,
      createdAt: new Date(),
      usageCount: 1
    };

    onSave(newFilter);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Create Feed Filter</h2>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Name & Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Filter Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="e.g., My Tech Feed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Describe what this filter includes..."
                rows={2}
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Keywords
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.currentKeyword}
                  onChange={(e) => setFormData({...formData, currentKeyword: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Add keyword..."
                />
                <button 
                  onClick={addKeyword}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.keywords.map((keyword) => (
                  <div key={keyword} className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                    <span className="text-sm">{keyword}</span>
                    <button 
                      onClick={() => removeItem('keywords', keyword)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.currentTag}
                  onChange={(e) => setFormData({...formData, currentTag: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Add tag..."
                />
                <button 
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 px-3 py-1 bg-secondary/10 rounded-full">
                    <span className="text-sm">#{tag}</span>
                    <button 
                      onClick={() => removeItem('tags', tag)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Locations
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Add location..."
                />
                <button 
                  onClick={addLocation}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.locations.map((location) => (
                  <div key={location} className="flex items-center gap-1 px-3 py-1 bg-accent/10 rounded-full">
                    <span className="text-sm">{location}</span>
                    <button 
                      onClick={() => removeItem('locations', location)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Types */}
            <div>
              <label className="block text-sm font-medium mb-2">Post Types</label>
              <div className="flex gap-2">
                {([
                  { type: 'photo' as const, icon: Image, label: 'Photos' },
                  { type: 'video' as const, icon: Video, label: 'Videos' },
                  { type: 'text' as const, icon: FileText, label: 'Text' }
                ]).map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => togglePostType(type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      formData.postTypes.includes(type)
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Creators & Min Likes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Creators
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.maxCreators}
                  onChange={(e) => setFormData({...formData, maxCreators: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-center text-sm mt-1">{formData.maxCreators} creators</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Min Likes</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minLikes}
                  onChange={(e) => setFormData({...formData, minLikes: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({...formData, isPublic: true})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border flex-1 ${
                    formData.isPublic
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </button>
                <button
                  onClick={() => setFormData({...formData, isPublic: false})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border flex-1 ${
                    !formData.isPublic
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { StoryCircle } from "./StoryCircle";

const stories = [
  { id: 1, name: "You", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop", isOwn: true, hasStory: false },
  { id: 2, name: "Sarah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop", hasStory: true },
  { id: 3, name: "Mike", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", hasStory: true },
  { id: 4, name: "Emma", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", hasStory: true },
  { id: 5, name: "John", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", hasStory: true },
  { id: 6, name: "Lisa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", hasStory: true },
];

export const StoriesRow = () => {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
      {stories.map((story) => (
        <StoryCircle
          key={story.id}
          image={story.image}
          name={story.name}
          isOwn={story.isOwn}
          hasStory={story.hasStory}
        />
      ))}
    </div>
  );
};

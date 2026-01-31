import { cn } from "@/lib/utils";

interface StoryCircleProps {
  image: string;
  name: string;
  isOwn?: boolean;
  hasStory?: boolean;
}

export const StoryCircle = ({ image, name, isOwn, hasStory = true }: StoryCircleProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
      <div className="relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full p-[2px]",
            hasStory
              ? "bg-gradient-to-br from-primary via-lime-400 to-lime-300"
              : "bg-border"
          )}
        >
          <div className="w-full h-full rounded-full bg-background p-[2px]">
            <img
              src={image}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        {isOwn && (
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
            <span className="text-primary-foreground text-xs font-bold">+</span>
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-[60px]">
        {isOwn ? "Your Story" : name}
      </span>
    </div>
  );
};

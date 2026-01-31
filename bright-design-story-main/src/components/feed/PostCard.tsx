import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

export const PostCard = ({
  author,
  image,
  caption,
  likes,
  comments,
  timeAgo,
}: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <article className="bg-card rounded-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-lime-400 p-[2px]">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full rounded-full object-cover bg-background"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{author.name}</span>
              {author.verified && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-primary-foreground">✓</span>
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <Button variant="ghost" size="iconSm">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={image}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={handleLike}
              className={cn(isLiked && "text-red-500")}
            >
              <Heart
                className={cn("w-6 h-6", isLiked && "fill-current")}
              />
            </Button>
            <Button variant="ghost" size="iconSm">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="iconSm">
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark
              className={cn("w-6 h-6", isSaved && "fill-current text-primary")}
            />
          </Button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-sm">
          {likeCount.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{author.name}</span>
          <span className="text-muted-foreground">{caption}</span>
        </div>

        {/* Comments */}
        {comments > 0 && (
          <button className="text-sm text-muted-foreground">
            View all {comments} comments
          </button>
        )}
      </div>
    </article>
  );
};

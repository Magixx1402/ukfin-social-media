import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PostCardProps {
  id: number;
  type: "photo" | "video" | "text";
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
}

export const PostCard = (post: PostCardProps) => {
  const { author, caption, likes, comments, timeAgo, type, image, videoUrl } =
    post;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Default video URL if none provided
  const defaultVideoUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Format time to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    videoRef.current.currentTime = percentage * duration;
    setCurrentTime(percentage * duration);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    // Only toggle play if not clicking on controls
    const target = e.target as HTMLElement;
    if (!target.closest(".video-controls")) {
      togglePlay();
    }
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{author.name}</span>
                {author.verified && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    ✓
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
          {/* Type badge */}
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        </div>

        {/* Media based on type */}
        {type === "photo" && image && (
          <>
            {/* Show caption above photo */}
            <p className="mb-4 whitespace-pre-line">{caption}</p>
            <div className="mb-4 rounded-xl overflow-hidden">
              <img
                src={image}
                alt={caption}
                className="w-full h-auto object-cover"
              />
            </div>
          </>
        )}

        {type === "video" && (
          <>
            {/* Show caption above video */}
            <p className="mb-4 whitespace-pre-line">{caption}</p>
            <div
              className="mb-4 rounded-xl overflow-hidden bg-gray-900 aspect-video relative group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              onClick={handleVideoClick}
            >
              {/* Video element with NO poster attribute */}
              <video
                ref={videoRef}
                src={videoUrl || defaultVideoUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                // No poster attribute - blank by default
              >
                Your browser does not support the video tag.
              </video>

              {/* Custom play button when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Custom video controls */}
              <div
                className={`video-controls absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"}`}
              >
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  className="h-1 bg-gray-600 rounded-full mb-3 cursor-pointer relative"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-white rounded-full absolute top-0 left-0"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full absolute -right-1.5 -top-1"></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    <div className="text-xs text-white/90 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-none"
                  >
                    Video
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}

        {type === "text" && (
          <div className="mb-4 p-4 bg-muted rounded-xl">
            {/* Show caption INSIDE the text box for text posts */}
            <p className="text-sm whitespace-pre-line">{caption}</p>
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{likes.toLocaleString()} likes</span>
            <span>{comments.toLocaleString()} comments</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Like</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="font-medium">Save</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  image: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
}

export const EventCard = ({
  title,
  image,
  date,
  location,
  attendees,
  category,
}: EventCardProps) => {
  return (
    <div className="min-w-[280px] bg-card rounded-2xl overflow-hidden animate-slide-up">
      <div className="relative h-36">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{attendees} attending</span>
          </div>
        </div>

        <Button variant="limeSoft" size="sm" className="w-full">
          Join Event
        </Button>
      </div>
    </div>
  );
};

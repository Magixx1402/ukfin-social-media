import { EventCard } from "./EventCard";
import { ChevronRight } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Tech Meetup: AI & Future",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    date: "Feb 15, 2026 • 6:00 PM",
    location: "Innovation Hub, Downtown",
    attendees: 234,
    category: "Tech",
  },
  {
    id: 2,
    title: "Music Festival Night",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    date: "Feb 20, 2026 • 8:00 PM",
    location: "Central Park Arena",
    attendees: 1205,
    category: "Music",
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
    date: "Feb 25, 2026 • 2:00 PM",
    location: "Business Center",
    attendees: 89,
    category: "Business",
  },
];

export const EventsSection = () => {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-bold">Upcoming Events</h2>
        <button className="flex items-center gap-1 text-primary text-sm font-medium">
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </section>
  );
};

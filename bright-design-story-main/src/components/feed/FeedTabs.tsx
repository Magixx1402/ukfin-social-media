import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "foryou", label: "For You" },
  { id: "following", label: "Following" },
  { id: "trending", label: "Trending" },
];

export const FeedTabs = () => {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div className="flex gap-2 px-4 py-2 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

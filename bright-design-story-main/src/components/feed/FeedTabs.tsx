import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All" },
  { id: "photos", label: "Photos" },
  { id: "videos", label: "Videos" },
  { id: "text", label: "Text" },
];

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const FeedTabs = ({ activeTab, onTabChange }: FeedTabsProps) => {
  return (
    <div className="flex gap-2 px-4 py-2 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
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
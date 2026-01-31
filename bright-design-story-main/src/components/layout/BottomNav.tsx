import { Home, Search, PlusSquare, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-6 h-6" />, label: "Home", active: true },
  { icon: <Search className="w-6 h-6" />, label: "Search" },
  { icon: <PlusSquare className="w-6 h-6" />, label: "Create" },
  { icon: <Calendar className="w-6 h-6" />, label: "Events" },
  { icon: <User className="w-6 h-6" />, label: "Profile" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4 safe-area-bottom">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
              item.active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.active ? (
              <div className="relative">
                {item.icon}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              </div>
            ) : (
              item.icon
            )}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

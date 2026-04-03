import { Heart, Home, Search, User } from "lucide-react";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: "home" as Page, label: "Home", Icon: Home },
  { id: "search" as Page, label: "Search", Icon: Search },
  { id: "favorites" as Page, label: "Favorites", Icon: Heart },
  { id: "profile" as Page, label: "Profile", Icon: User },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const activePage = ["detail", "admin"].includes(currentPage)
    ? null
    : currentPage;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{ background: "#151515", borderTop: "1px solid #2A2A2A" }}
    >
      <div className="flex w-full max-w-[430px] justify-around px-2 py-2">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.link`}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all duration-200"
            >
              <Icon
                size={22}
                style={{ color: isActive ? "#E00000" : "#8E8E8E" }}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: isActive ? "#E00000" : "#8E8E8E" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

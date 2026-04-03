import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Destination } from "./backend.d";
import BottomNav from "./components/BottomNav";
import EHShieldLogo from "./components/EHShieldLogo";
import AdminPage from "./pages/AdminPage";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const navigate = (page: Page, destination?: Destination) => {
    if (destination) setSelectedDestination(destination);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "search":
        return <SearchPage onNavigate={navigate} />;
      case "favorites":
        return <FavoritesPage onNavigate={navigate} />;
      case "profile":
        return <ProfilePage onNavigate={navigate} />;
      case "detail":
        return selectedDestination ? (
          <DetailPage destination={selectedDestination} onNavigate={navigate} />
        ) : (
          <HomePage onNavigate={navigate} />
        );
      case "admin":
        return <AdminPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const showBottomNav = currentPage !== "admin";

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      {/* Center content on desktop */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showBottomNav && (
        <BottomNav currentPage={currentPage} onNavigate={navigate} />
      )}

      {/* Footer */}
      <footer
        className="text-center py-4 pb-24"
        style={{ background: "#0A0A0A", borderTop: "1px solid #1B1B1B" }}
      >
        <div className="flex flex-col items-center gap-3 max-w-[430px] mx-auto px-4">
          <EHShieldLogo size={40} />
          <div className="flex gap-6 flex-wrap justify-center">
            {["About", "Destinations", "Packages", "Contact", "Privacy"].map(
              (link) => (
                <button
                  type="button"
                  key={link}
                  className="text-xs transition-colors duration-200 hover:opacity-80"
                  style={{ color: "#8E8E8E" }}
                >
                  {link}
                </button>
              ),
            )}
          </div>
          <p className="text-xs" style={{ color: "#2A2A2A" }}>
            &copy; {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
              style={{ color: "#2A2A2A" }}
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

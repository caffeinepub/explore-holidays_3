import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Edit2,
  LogIn,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useIsAdmin,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveProfile();
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const isLoggedIn = !!identity;
  const displayName = profile?.name || "Traveller";
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 10)}...${principal.slice(-4)}`
    : "";

  const handleSaveName = () => {
    if (nameInput.trim()) {
      saveProfile.mutate({ name: nameInput.trim() });
    }
    setEditName(false);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      <div className="max-w-[430px] mx-auto px-4 pt-12">
        <h1 className="font-display text-3xl mb-6" style={{ color: "#F2F2F2" }}>
          PROFILE
        </h1>

        {!isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: "#1B1B1B", border: "2px solid #2A2A2A" }}
            >
              <User size={40} style={{ color: "#8E8E8E" }} />
            </div>
            <h2
              className="font-heading text-xl font-semibold mb-2"
              style={{ color: "#F2F2F2" }}
            >
              Welcome, Traveller
            </h2>
            <p className="text-sm mb-8" style={{ color: "#8E8E8E" }}>
              Sign in to save favourites and manage your bookings
            </p>
            <button
              type="button"
              data-ocid="profile.login.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-heading font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{ background: "#E00000", color: "#F2F2F2" }}
            >
              <LogIn size={18} />
              {isLoggingIn ? "Connecting..." : "Sign In"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* User card */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(224,0,0,0.15)",
                    border: "2px solid rgba(224,0,0,0.4)",
                  }}
                >
                  <User size={28} style={{ color: "#E00000" }} />
                </div>
                <div className="flex-1 min-w-0">
                  {editName ? (
                    <div className="flex gap-2">
                      <Input
                        data-ocid="profile.name.input"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Your name"
                        className="h-8 text-sm"
                        style={{
                          background: "#2A2A2A",
                          borderColor: "#3A3A3A",
                          color: "#F2F2F2",
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      />
                      <Button
                        data-ocid="profile.name.save_button"
                        size="sm"
                        onClick={handleSaveName}
                        style={{ background: "#E00000", color: "#F2F2F2" }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2
                        className="font-heading font-bold text-lg"
                        style={{ color: "#F2F2F2" }}
                      >
                        {displayName}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setEditName(true);
                          setNameInput(displayName);
                        }}
                      >
                        <Edit2 size={14} style={{ color: "#8E8E8E" }} />
                      </button>
                    </div>
                  )}
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "#8E8E8E" }}
                  >
                    {shortPrincipal}
                  </p>
                  {isAdmin && (
                    <span
                      className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "rgba(224,0,0,0.2)",
                        color: "#E00000",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
            >
              {isAdmin && (
                <button
                  type="button"
                  data-ocid="profile.admin.button"
                  onClick={() => onNavigate("admin")}
                  className="w-full flex items-center gap-3 px-5 py-4 transition-all duration-200 hover:opacity-80"
                  style={{ borderBottom: "1px solid #2A2A2A" }}
                >
                  <Shield size={18} style={{ color: "#E00000" }} />
                  <span
                    className="flex-1 text-left text-sm font-medium"
                    style={{ color: "#F2F2F2" }}
                  >
                    Admin Panel
                  </span>
                  <ChevronRight size={16} style={{ color: "#8E8E8E" }} />
                </button>
              )}
              <button
                type="button"
                className="w-full flex items-center gap-3 px-5 py-4 transition-all duration-200 hover:opacity-80"
                style={{ borderBottom: "1px solid #2A2A2A" }}
              >
                <Settings size={18} style={{ color: "#8E8E8E" }} />
                <span
                  className="flex-1 text-left text-sm font-medium"
                  style={{ color: "#F2F2F2" }}
                >
                  Preferences
                </span>
                <ChevronRight size={16} style={{ color: "#8E8E8E" }} />
              </button>
              <button
                type="button"
                data-ocid="profile.logout.button"
                onClick={clear}
                className="w-full flex items-center gap-3 px-5 py-4 transition-all duration-200 hover:opacity-80"
              >
                <LogOut size={18} style={{ color: "#E00000" }} />
                <span
                  className="flex-1 text-left text-sm font-medium"
                  style={{ color: "#E00000" }}
                >
                  Sign Out
                </span>
                <ChevronRight size={16} style={{ color: "#8E8E8E" }} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

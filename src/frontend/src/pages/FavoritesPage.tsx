import { Heart, MapPin } from "lucide-react";
import { motion } from "motion/react";
import type { Destination } from "../backend.d";
import { useFavorites } from "../hooks/useQueries";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface FavoritesPageProps {
  onNavigate: (page: Page, destination?: Destination) => void;
}

export default function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  const { data: favorites = [], isLoading } = useFavorites();

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      <div className="px-4 pt-12 pb-4">
        <div className="max-w-[430px] mx-auto">
          <h1
            className="font-display text-3xl mb-1"
            style={{ color: "#F2F2F2" }}
          >
            FAVOURITES
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8E8E8E" }}>
            Your saved holiday destinations
          </p>

          {isLoading ? (
            <div
              data-ocid="favorites.loading_state"
              className="flex justify-center py-16"
            >
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "#E00000",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : favorites.length === 0 ? (
            <motion.div
              data-ocid="favorites.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "#1B1B1B" }}
              >
                <Heart size={36} style={{ color: "#2A2A2A" }} />
              </div>
              <p
                className="font-display text-2xl mb-2"
                style={{ color: "#2A2A2A" }}
              >
                NO FAVOURITES YET
              </p>
              <p className="text-sm mb-6" style={{ color: "#8E8E8E" }}>
                Start exploring and save destinations you love
              </p>
              <button
                type="button"
                data-ocid="favorites.explore.primary_button"
                onClick={() => onNavigate("search")}
                className="px-6 py-3 rounded-full font-heading font-semibold uppercase tracking-wider text-sm transition-all duration-200"
                style={{ background: "#E00000", color: "#F2F2F2" }}
              >
                Explore Destinations
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3" data-ocid="favorites.list">
              {favorites.map((dest, i) => (
                <motion.div
                  key={dest.id.toString()}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`favorites.item.${i + 1}`}
                >
                  <FavCard dest={dest} onNavigate={onNavigate} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FavCard({
  dest,
  onNavigate,
}: { dest: Destination; onNavigate: (page: any, dest?: Destination) => void }) {
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03]"
      style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
      onClick={() => onNavigate("detail", dest)}
      onKeyDown={(e) => e.key === "Enter" && onNavigate("detail", dest)}
    >
      <div className="relative h-36">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(224,0,0,0.9)" }}
        >
          <Heart size={12} fill="#F2F2F2" style={{ color: "#F2F2F2" }} />
        </div>
      </div>
      <div className="p-3">
        <h3
          className="font-heading font-semibold text-sm"
          style={{ color: "#F2F2F2" }}
        >
          {dest.name}
        </h3>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={9} style={{ color: "#8E8E8E" }} />
          <span className="text-[11px]" style={{ color: "#8E8E8E" }}>
            {dest.country}
          </span>
        </div>
        <p className="font-bold text-sm mt-1.5" style={{ color: "#E00000" }}>
          ${Number(dest.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

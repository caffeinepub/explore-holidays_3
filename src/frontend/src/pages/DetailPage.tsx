import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Heart,
  MapPin,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Destination } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddFavorite,
  useFavorites,
  useRemoveFavorite,
} from "../hooks/useQueries";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface DetailPageProps {
  destination: Destination;
  onNavigate: (page: Page, destination?: Destination) => void;
}

export default function DetailPage({
  destination,
  onNavigate,
}: DetailPageProps) {
  const { identity } = useInternetIdentity();
  const { data: favorites = [] } = useFavorites();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const [booked, setBooked] = useState(false);

  const isFavorited = favorites.some((f) => f.id === destination.id);

  const handleToggleFav = () => {
    if (!identity) {
      onNavigate("profile");
      return;
    }
    if (isFavorited) {
      removeFav.mutate(destination.id);
    } else {
      addFav.mutate(destination.id);
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      {/* Hero Image */}
      <div className="relative h-72">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.9) 100%)",
          }}
        />
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 max-w-[430px] mx-auto w-full">
          <button
            type="button"
            data-ocid="detail.back.button"
            onClick={() => onNavigate("home")}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(10,10,10,0.7)", color: "#F2F2F2" }}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            data-ocid="detail.favorite.toggle"
            onClick={handleToggleFav}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: isFavorited
                ? "rgba(224,0,0,0.9)"
                : "rgba(10,10,10,0.7)",
              color: "#F2F2F2",
            }}
          >
            <Heart size={20} fill={isFavorited ? "#F2F2F2" : "none"} />
          </button>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 max-w-[430px] mx-auto">
          <span
            className="inline-block mb-2 text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: "rgba(224,0,0,0.9)", color: "#F2F2F2" }}
          >
            {destination.destinationType}
          </span>
          <h1
            className="font-display text-4xl leading-none"
            style={{ color: "#F2F2F2" }}
          >
            {destination.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={12} style={{ color: "#B8B8B8" }} />
            <span className="text-sm" style={{ color: "#B8B8B8" }}>
              {destination.country}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[430px] mx-auto px-4 pt-6 space-y-6"
      >
        {/* Stats row */}
        <div className="flex gap-3">
          <div
            className="flex-1 flex items-center gap-2 p-3 rounded-xl"
            style={{ background: "#1B1B1B" }}
          >
            <Star size={16} style={{ color: "#E00000" }} fill="#E00000" />
            <div>
              <p className="text-xs" style={{ color: "#8E8E8E" }}>
                Rating
              </p>
              <p className="text-sm font-bold" style={{ color: "#F2F2F2" }}>
                4.9 / 5.0
              </p>
            </div>
          </div>
          <div
            className="flex-1 flex items-center gap-2 p-3 rounded-xl"
            style={{ background: "#1B1B1B" }}
          >
            <Clock size={16} style={{ color: "#E00000" }} />
            <div>
              <p className="text-xs" style={{ color: "#8E8E8E" }}>
                Duration
              </p>
              <p className="text-sm font-bold" style={{ color: "#F2F2F2" }}>
                7 Days
              </p>
            </div>
          </div>
          <div
            className="flex-1 flex items-center gap-2 p-3 rounded-xl"
            style={{ background: "#1B1B1B" }}
          >
            <MapPin size={16} style={{ color: "#E00000" }} />
            <div>
              <p className="text-xs" style={{ color: "#8E8E8E" }}>
                Type
              </p>
              <p className="text-sm font-bold" style={{ color: "#F2F2F2" }}>
                {destination.destinationType}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2
            className="font-heading font-semibold text-lg mb-2"
            style={{ color: "#F2F2F2" }}
          >
            About
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#B8B8B8" }}>
            {destination.description}
          </p>
        </div>

        {/* Highlights */}
        <div>
          <h2
            className="font-heading font-semibold text-lg mb-3"
            style={{ color: "#F2F2F2" }}
          >
            Highlights
          </h2>
          <div className="space-y-2">
            {destination.highlights.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <CheckCircle
                  size={16}
                  style={{ color: "#E00000", flexShrink: 0 }}
                />
                <span className="text-sm" style={{ color: "#B8B8B8" }}>
                  {h}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing + CTA */}
        <div
          className="p-4 rounded-2xl"
          style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
          data-ocid="detail.booking.card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs" style={{ color: "#8E8E8E" }}>
                Starting from
              </p>
              <p className="font-display text-3xl" style={{ color: "#E00000" }}>
                ${Number(destination.price).toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: "#8E8E8E" }}>
                per person
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "#8E8E8E" }}>
                Availability
              </p>
              <p className="text-sm font-semibold" style={{ color: "#4CAF50" }}>
                ✓ Available
              </p>
            </div>
          </div>
          {booked ? (
            <div
              data-ocid="detail.booking.success_state"
              className="py-4 text-center"
            >
              <p
                className="font-heading font-bold text-lg"
                style={{ color: "#4CAF50" }}
              >
                ✓ Booking Confirmed!
              </p>
              <p className="text-sm mt-1" style={{ color: "#8E8E8E" }}>
                Check your email for details
              </p>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="detail.book.primary_button"
              onClick={() => setBooked(true)}
              className="w-full py-4 rounded-xl font-heading font-bold uppercase tracking-wider text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#E00000", color: "#F2F2F2" }}
            >
              Book Now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

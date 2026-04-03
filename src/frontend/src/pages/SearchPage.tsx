import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Destination } from "../backend.d";
import { SAMPLE_DESTINATIONS, TYPE_FILTERS } from "../data/sampleData";
import { useDestinations } from "../hooks/useQueries";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface SearchPageProps {
  onNavigate: (page: Page, destination?: Destination) => void;
}

export default function SearchPage({ onNavigate }: SearchPageProps) {
  const { data: destData } = useDestinations();
  const destinations = destData?.length ? destData : SAMPLE_DESTINATIONS;

  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase());
      const matchesType =
        activeType === "All" || d.destinationType === activeType;
      const matchesPrice = Number(d.price) <= maxPrice;
      return matchesQuery && matchesType && matchesPrice;
    });
  }, [destinations, query, activeType, maxPrice]);

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      {/* Header */}
      <div
        className="px-4 pt-12 pb-4 sticky top-0 z-40"
        style={{
          background: "rgba(10,10,10,0.97)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <h1
            className="font-display text-3xl mb-4"
            style={{ color: "#F2F2F2" }}
          >
            DISCOVER
          </h1>
          {/* Search bar */}
          <div className="flex gap-2">
            <div
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
            >
              <Search size={16} style={{ color: "#8E8E8E" }} />
              <input
                data-ocid="search.search_input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "#F2F2F2" }}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")}>
                  <X size={14} style={{ color: "#8E8E8E" }} />
                </button>
              )}
            </div>
            <button
              type="button"
              data-ocid="search.filter.toggle"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-xl transition-all duration-200"
              style={{
                background: showFilters ? "#E00000" : "#1B1B1B",
                border: `1px solid ${showFilters ? "#E00000" : "#2A2A2A"}`,
                color: "#F2F2F2",
              }}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Type filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {TYPE_FILTERS.map((type) => (
              <button
                type="button"
                key={type}
                data-ocid={`search.filter.${type.toLowerCase()}.tab`}
                onClick={() => setActiveType(type)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeType === type ? "#E00000" : "#1B1B1B",
                  color: activeType === type ? "#F2F2F2" : "#B8B8B8",
                  border: `1px solid ${activeType === type ? "#E00000" : "#2A2A2A"}`,
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Price filter */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 rounded-xl"
              style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "#B8B8B8" }}
                >
                  Max Price
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#E00000" }}
                >
                  ${maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                data-ocid="search.price.input"
                type="range"
                min={500}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-red-600"
                style={{ accentColor: "#E00000" }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[430px] mx-auto px-4 pt-4">
        <p className="text-xs mb-4" style={{ color: "#8E8E8E" }}>
          {filtered.length} destination{filtered.length !== 1 ? "s" : ""} found
        </p>

        {filtered.length === 0 ? (
          <div data-ocid="search.empty_state" className="text-center py-16">
            <p
              className="font-display text-2xl mb-2"
              style={{ color: "#2A2A2A" }}
            >
              NO RESULTS
            </p>
            <p className="text-sm" style={{ color: "#8E8E8E" }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-3"
            data-ocid="search.results.list"
          >
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id.toString()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                data-ocid={`search.results.item.${i + 1}`}
              >
                <SearchDestCard dest={dest} onNavigate={onNavigate} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchDestCard({
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
      <div className="relative h-32">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 60%)",
          }}
        />
        <span
          className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(224,0,0,0.9)", color: "#F2F2F2" }}
        >
          {dest.destinationType}
        </span>
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

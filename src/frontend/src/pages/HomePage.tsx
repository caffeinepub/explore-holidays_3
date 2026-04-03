import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Menu,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Destination, Package } from "../backend.d";
import EHShieldLogo from "../components/EHShieldLogo";
import { SAMPLE_DESTINATIONS, SAMPLE_PACKAGES } from "../data/sampleData";
import { useDestinations, usePackages } from "../hooks/useQueries";

type Page = "home" | "search" | "favorites" | "profile" | "detail" | "admin";

interface HomePageProps {
  onNavigate: (page: Page, destination?: Destination) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: destData } = useDestinations();
  const { data: pkgData } = usePackages();
  const [pkgScrollIndex, setPkgScrollIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const destinations: Destination[] = destData?.length
    ? destData
    : SAMPLE_DESTINATIONS;
  const packages: Package[] = pkgData?.length ? pkgData : SAMPLE_PACKAGES;

  const featured = destinations.filter((d) => d.isFeatured).slice(0, 3);
  const popular = packages.filter((p) => p.isPopular);

  const scrollPkgs = (dir: "left" | "right") => {
    setPkgScrollIndex((prev) => {
      const max = Math.max(0, popular.length - 1);
      return dir === "left" ? Math.max(0, prev - 1) : Math.min(max, prev + 1);
    });
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 pt-10 pb-4"
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center justify-between max-w-[430px] mx-auto">
          <div className="flex items-center gap-2">
            <EHShieldLogo size={38} />
            <div>
              <span
                className="font-display text-xl tracking-widest"
                style={{ color: "#F2F2F2" }}
              >
                EXPLORE
              </span>
              <span
                className="font-display text-xl tracking-widest"
                style={{ color: "#E00000" }}
              >
                {" "}
                HOLIDAYS
              </span>
            </div>
          </div>
          <button
            type="button"
            data-ocid="nav.menu.button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#F2F2F2" }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <div className="max-w-[430px] mx-auto px-4 space-y-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-ocid="home.section"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: "260px" }}
          >
            <img
              src="/assets/generated/hero-travel.dim_800x500.jpg"
              alt="Explore the world"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p
                className="text-xs font-medium tracking-[0.3em] uppercase mb-1"
                style={{ color: "#E00000" }}
              >
                Premium Travel Experiences
              </p>
              <h1
                className="font-display text-4xl leading-none mb-3"
                style={{ color: "#F2F2F2" }}
              >
                DISCOVER YOUR PERFECT ESCAPE
              </h1>
              <button
                type="button"
                data-ocid="home.explore.primary_button"
                onClick={() => onNavigate("search")}
                className="self-start flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:shadow-lg"
                style={{ background: "#E00000", color: "#F2F2F2" }}
              >
                Explore Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Featured Destinations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-display text-2xl tracking-wide"
              style={{ color: "#F2F2F2" }}
            >
              FEATURED DESTINATIONS
            </h2>
            <button
              type="button"
              data-ocid="home.destinations.link"
              onClick={() => onNavigate("search")}
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "#E00000" }}
            >
              See All
            </button>
          </div>

          <div className="space-y-3" data-ocid="home.destinations.list">
            {featured.map((dest, i) => (
              <motion.div
                key={dest.id.toString()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                data-ocid={`home.destinations.item.${i + 1}`}
              >
                <DestinationCard dest={dest} onNavigate={onNavigate} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Packages */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-display text-2xl tracking-wide"
              style={{ color: "#F2F2F2" }}
            >
              POPULAR PACKAGES
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="home.packages.pagination_prev"
                onClick={() => scrollPkgs("left")}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: pkgScrollIndex === 0 ? "#2A2A2A" : "#E00000",
                  color: "#F2F2F2",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                data-ocid="home.packages.pagination_next"
                onClick={() => scrollPkgs("right")}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background:
                    pkgScrollIndex >= popular.length - 1
                      ? "#2A2A2A"
                      : "#E00000",
                  color: "#F2F2F2",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div
              className="flex gap-3 transition-transform duration-300"
              style={{ transform: `translateX(-${pkgScrollIndex * 200}px)` }}
            >
              {popular.map((pkg, i) => (
                <PackageCard key={pkg.id.toString()} pkg={pkg} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DestinationCard({
  dest,
  onNavigate,
}: { dest: Destination; onNavigate: (page: any, dest?: Destination) => void }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{ background: "#1B1B1B", border: "1px solid #2A2A2A" }}
      onClick={() => onNavigate("detail", dest)}
      onKeyDown={(e) => e.key === "Enter" && onNavigate("detail", dest)}
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="font-heading font-semibold text-base truncate"
          style={{ color: "#F2F2F2" }}
        >
          {dest.name}
        </h3>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} style={{ color: "#8E8E8E" }} />
          <span className="text-xs" style={{ color: "#8E8E8E" }}>
            {dest.country}
          </span>
        </div>
        <span
          className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(224,0,0,0.15)",
            color: "#E00000",
            border: "1px solid rgba(224,0,0,0.3)",
          }}
        >
          {dest.destinationType}
        </span>
        <p className="text-sm font-bold mt-1" style={{ color: "#E00000" }}>
          From ${Number(dest.price).toLocaleString()}
        </p>
      </div>
      <button
        type="button"
        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 hover:opacity-90"
        style={{ background: "#F6F6F6", color: "#111111" }}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate("detail", dest);
        }}
      >
        Explore
      </button>
    </div>
  );
}

function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  return (
    <div
      data-ocid={`home.packages.item.${index + 1}`}
      className="relative flex-shrink-0 w-48 h-64 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03]"
    >
      <img
        src={pkg.imageUrl}
        alt={pkg.title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.2) 60%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p
          className="font-heading font-bold text-sm uppercase leading-tight"
          style={{ color: "#F2F2F2" }}
        >
          {pkg.title}
        </p>
        <p className="font-bold text-sm mt-0.5" style={{ color: "#E00000" }}>
          ${Number(pkg.price).toLocaleString()}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#8E8E8E" }}>
          {Number(pkg.durationDays)} days
        </p>
      </div>
    </div>
  );
}

# Explore Holidays

## Current State
New project. Empty backend actor and no frontend application code yet.

## Requested Changes (Diff)

### Add
- Full mobile-first holiday discovery app with deep black / bold red premium aesthetic
- EH shield logo displayed in splash/hero header
- Holiday destination discovery with card tiles (featured destinations)
- Search and filter bar (by destination name, type: beach/adventure/city/culture, price range)
- Holiday detail view with description, highlights, pricing, "Book Now" CTA
- Popular Packages horizontally scrollable section
- Bottom navigation bar: Home, Search, Favorites, Profile
- Admin management panel: add/edit/remove destinations, packages, featured content
- Authorization system (admin vs regular user roles)
- Smooth animations throughout, rounded cards, red-black aesthetic

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Select `authorization` component for admin/user role management
2. Generate Motoko backend with:
   - Destinations CRUD (id, name, country, type, description, highlights, price, imageUrl, isFeatured)
   - Packages CRUD (id, title, destinationId, duration, price, imageUrl, inclusions)
   - Favorites per user (add/remove/list)
   - Admin-only write operations, public read operations
3. Frontend:
   - index.css with OKLCH design tokens: black background, red accent, white/grey text, Inter/system heavy font
   - SplashScreen / Hero with EH shield logo SVG and tagline
   - Home screen: featured destinations grid + popular packages horizontal scroll
   - Search screen: search input + type/price filters + destination results list
   - Detail screen: destination info, highlights, pricing, Book Now button
   - Favorites screen: saved destinations
   - Profile screen: login/logout, admin link
   - Admin panel: tabs for Destinations and Packages with add/edit/delete forms
   - Bottom navigation bar component
   - Smooth page transitions and card hover animations

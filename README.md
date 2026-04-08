# Seasonal Calendar Sanctuary

A highly polished, interactive React component inspired by a physical wall calendar aesthetic, infused with dynamic seasonal intelligence ("Ritu") and atmospheric context.

## 🌟 Objective & Vision
This project translates a static design concept into a highly functional, responsive, and tactile web component. It serves as a digital sanctuary that elegantly blends master-detail UI patterns (wall calendar grid alongside an integrated, animated notes section) with cinematic rendering techniques.

## 🛠 Features

### Core Requirements Fulfilled
- **Wall Calendar Aesthetic:** A split-pane architecture (on desktop) featuring an atmospheric, dynamic hero section with liquid mesh gradients and subtle typography to maintain a premium sense of spatial arrangement.
- **Day Range Selector:** Users can click to select a single date, or select an initial start date and a final end date to highlight a specific date range smoothly across the calendar grid.
- **Integrated Notes Section:** Jot down contextual memories mapped directly to either a single date or across a custom selected date range. Your notes persist locally seamlessly.
- **Fully Responsive Design:** The layout fluidly collapses from a horizontal master-detail landscape on Desktop to a vertically stacked, touch-friendly scroll on Mobile.

### ✨ Creative Liberty (The Stand-Out Polish)
- **Mouse-driven 3D Parallax & Glare:** The desktop features a Polaroid-style "Sanctuary Memory" thumbnail that reacts to mouse movement using `framer-motion` springs.
- **Atmospheric Time-of-Day Engine:** The background color, particle speed, and liquid mesh flares shift automatically based on the hour of the day (Morning, Afternoon, Evening, Night).
- **SVG Heat-Haze Effects:** Dynamic micro-seasons (like *Grishma* / Summer) introduce subtle `feTurbulence` filters to simulate atmospheric heat distortion.
- **Ritualistic Input Tracing:** The notes input features a sleek conic-gradient animated border that reveals on focus, mimicking a premium journaling experience.

## 🏗 Technical Choices
- **React (Vite):** Chosen for fast HMR and lightweight component architecture.
- **Framer Motion:** Heavy lifting for all layout animations, shared text crossfades, physical spring animations, and AnimatePresence DOM updates.
- **Tailwind CSS:** For rapid layout building, supplemented by advanced vanilla CSS for masking, mesh gradients, and backdrop blur filters.
- **Contextual Memory (localStorage):** Keeps notes storage localized directly on the client, using zero backend dependencies, preserving data persistently between reloads.

## 🚀 How to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
3. **View the Component:** Open your browser to the local Vite URL (typically `http://localhost:5173`).

---

*Enjoy the Sanctuary.*

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { getCurrentMicroSeason, getTransitionState, type MicroSeason } from './logic/seasonal-engine';
import { getAllNotes, addNoteForDate, updateNoteForDate, getDaysInMonth } from './logic/contextual-memory';

interface ThemeColors {
  primary: string;
  onPrimary: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface AtmosphereConfig {
  id: TimeOfDay;
  bgColor: string;
  flareColor: string;
  speedMultiplier: number;
}

const ATMOSPHERE_MATRIX: Record<TimeOfDay, AtmosphereConfig> = {
  morning: { id: 'morning', bgColor: '#1e1b4b', flareColor: '#ffb703', speedMultiplier: 1.3 }, // Deep indigo haze, bright sunrise flare
  afternoon: { id: 'afternoon', bgColor: '#0f172a', flareColor: '#38bdf8', speedMultiplier: 1.0 }, // Crisp dark slate, vivid daytime light
  evening: { id: 'evening', bgColor: '#2e1025', flareColor: '#f95738', speedMultiplier: 0.7 }, // Dusky deep plum, striking sunset flare
  night: { id: 'night', bgColor: '#0c0a09', flareColor: 'transparent', speedMultiplier: 0.4 } // Pitch black void, invisible flare, extremely slow ambient movement
};

export const getAtmosphereForTime = (date: Date): AtmosphereConfig => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return ATMOSPHERE_MATRIX.morning;
  if (hour >= 12 && hour < 17) return ATMOSPHERE_MATRIX.afternoon;
  if (hour >= 17 && hour < 20) return ATMOSPHERE_MATRIX.evening;
  return ATMOSPHERE_MATRIX.night;
};

const SEASONAL_COLORS: Record<string, ThemeColors> = {
  'Vasant': { primary: '#3b683b', onPrimary: '#ffffff' },      // Green (Spring)
  'Grishma': { primary: '#b85e00', onPrimary: '#ffffff' },     // Amber (Summer)
  'Varsha': { primary: '#00668a', onPrimary: '#ffffff' },      // Teal (Monsoon)
  'Sharad': { primary: '#8a4c00', onPrimary: '#ffffff' },      // Orange (Autumn)
  'Hemant': { primary: '#605470', onPrimary: '#ffffff' },      // Purple (Pre-Winter)
  'Shishir': { primary: '#005c8a', onPrimary: '#ffffff' },     // Blue (Winter)
};

interface SeasonalContextType {
  currentSeason: MicroSeason | null;
  isTransitioning: boolean;
  themeColors: ThemeColors;
  atmosphere: AtmosphereConfig;
  currentDate: Date;
  monthDays: Date[];
  allNotes: Record<string, string[]>;
  addNote: (dateStr: string, text: string) => void;
  updateNote: (dateStr: string, index: number, text: string) => void;
}

const SeasonalContext = createContext<SeasonalContextType | null>(null);

export const SeasonalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentSeason, setCurrentSeason] = useState<MicroSeason | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [themeColors, setThemeColors] = useState<ThemeColors>(SEASONAL_COLORS['Vasant']);
  const [atmosphere, setAtmosphere] = useState<AtmosphereConfig>(ATMOSPHERE_MATRIX.night);
  const [allNotes, setAllNotes] = useState<Record<string, string[]>>({});
  const [monthDays, setMonthDays] = useState<Date[]>([]);

  useEffect(() => {
    // 1. Set current date & month grid
    const today = new Date();
    setCurrentDate(today);
    setMonthDays(getDaysInMonth(today.getFullYear(), today.getMonth()));

    // 2. Identify Season
    const season = getCurrentMicroSeason(today);
    setCurrentSeason(season);
    document.title = `${season.ritu} | WeNoteHere`;

    // 3. Get Asset and Transition state
    setIsTransitioning(getTransitionState(today));

    // 4. Update Colors & Atmosphere
    if (SEASONAL_COLORS[season.ritu]) {
      setThemeColors(SEASONAL_COLORS[season.ritu]);
    }
    setAtmosphere(getAtmosphereForTime(today));

    // 5. Load Memory
    setAllNotes(getAllNotes());

  }, []);

  const addNote = (dateStr: string, text: string) => {
    addNoteForDate(dateStr, text);
    setAllNotes(getAllNotes());
  };

  const updateNote = (dateStr: string, index: number, text: string) => {
    updateNoteForDate(dateStr, index, text);
    setAllNotes(getAllNotes());
  };

  if (!currentSeason) return null; // App loading

  return (
    <SeasonalContext.Provider value={{
      currentSeason,
      isTransitioning,
      themeColors,
      atmosphere,
      currentDate,
      monthDays,
      allNotes,
      addNote,
      updateNote
    }}>
      {children}
    </SeasonalContext.Provider>
  );
};

export const useSeasonalCalendar = () => {
  const context = useContext(SeasonalContext);
  if (!context) throw new Error("Must be used within SeasonalProvider");
  return context;
};

// Global Theming Wrapper
export const SeasonalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeColors, atmosphere } = useSeasonalCalendar();

  return (
    <div 
      className="seasonal-wrapper text-white min-h-screen w-full transition-colors duration-[3s] ease-in-out"
      style={{
        backgroundColor: atmosphere.bgColor,
        '--primary-seasonal': themeColors.primary,
        '--primary-seasonal-alpha': `${themeColors.primary}25`,
        '--primary-seasonal-glow': `${themeColors.primary}40`,
      } as React.CSSProperties}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${themeColors.primary}-${atmosphere.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SeasonalProvider, SeasonalWrapper, useSeasonalCalendar } from './useSeasonalCalendar';
import { AmbientParticles } from './components/AmbientParticles';

const SEASONAL_QUOTES: Record<string, string> = {
  'Vasant': "The earth laughs in flowers. Let your spirit breathe its new life.",
  'Grishma': "In the heart of the sun, find the fire to forge your resilience.",
  'Varsha': "Let the rains wash away the old, nurturing the seeds of tomorrow.",
  'Sharad': "As the leaves fall, learn to let go with grace and a peaceful mind.",
  'Hemant': "The first chill whispers of stillness. Find warmth within your soul.",
  'Shishir': "In the deep frost, nature dreams. Take this time to heal and rest."
};

const SavedIndicator = ({ isSaved }: { isSaved: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: isSaved ? 1 : 0, scale: isSaved ? 1 : 0.8 }}
    transition={{ duration: 0.3 }}
    className="absolute right-0 top-1 text-primary pointer-events-none"
  >
    <CheckCircle2 size={18} />
  </motion.div>
);

const LiquidMeshBackground = ({ color, atmosphere, isGrishma, motionX, motionY }: { color: string, atmosphere: any, isGrishma: boolean, motionX: MotionValue, motionY: MotionValue }) => {
  const speed = Math.max(0.1, atmosphere.speedMultiplier);
  
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-black/20 -z-10 isolate transition-colors duration-[3s]"
      style={{ 
        filter: isGrishma ? 'url(#heat-haze)' : 'none',
        x: useTransform(motionX, [-0.5, 0.5], ['-2%', '2%']),
        y: useTransform(motionY, [-0.5, 0.5], ['-2%', '2%']),
        scale: 1.05
      }}
    >
      {/* Orb 1: Warm ambient glow */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
          x: ["-10%", "15%", "-10%"],
          y: ["-10%", "10%", "-10%"],
        }}
        transition={{ duration: 22 / speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[160vw] h-[160vh] rounded-full blur-[140px] mix-blend-screen origin-center"
        style={{ backgroundImage: `radial-gradient(circle, ${color} 0%, transparent 60%)`, top: '-30%', left: '-30%' }}
      />
      {/* Orb 2: Counter-rotating secondary glow */}
      <motion.div
        animate={{
          scale: [1.2, 0.9, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: ["10%", "-20%", "10%"],
          y: ["15%", "-5%", "15%"],
        }}
        transition={{ duration: 28 / speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[130vw] h-[130vh] rounded-full blur-[150px] mix-blend-screen origin-center"
        style={{ backgroundImage: `radial-gradient(circle, ${color} 0%, transparent 70%)`, bottom: '-15%', right: '-15%' }}
      />
      {/* Orb 3: Atmospheric Time Flare */}
      {atmosphere.flareColor !== 'transparent' && (
        <motion.div
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.4, 0.8, 0.4],
            y: ["-10%", "10%", "-10%"]
          }}
          transition={{ duration: 18 / speed, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[110vw] h-[110vh] rounded-full blur-[120px] mix-blend-screen origin-center"
          style={{ backgroundImage: `radial-gradient(circle, ${atmosphere.flareColor} 0%, transparent 50%)`, top: '-5%', right: '-10%' }}
        />
      )}
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
    </motion.div>
  );
};

const MonthGrid = ({ todayDate, selectedDateStr, onSelectDate, themeColors, allNotes }: any) => {
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  
  // Format local date securely avoiding timezone shifts
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayStr = `${year}-${pad(month+1)}-${pad(todayDate.getDate())}`;
  
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const gridCells = (Array.from({ length: startOffset }, () => null) as Array<number | null>).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div 
      className="bg-black/40 p-4 xl:p-6 rounded-3xl border border-white/5 border-t-white/10 border-l-white/10 shadow-2xl relative overflow-hidden backdrop-blur-3xl backdrop-saturate-150 h-fit transition-all duration-[2s]"
      style={{ boxShadow: '0 20px 80px var(--primary-seasonal-alpha)', ...({ '--tw-backdrop-blur': 'blur(40px)' } as any) }}
    >
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="noto-serif text-2xl tracking-wide text-stone-200">{todayDate.toLocaleDateString('en-US', { month: 'long' })}</h3>
        <span className="manrope font-bold text-stone-500">{year}</span>
      </div>
      <div className="grid grid-cols-7 text-center gap-y-4 gap-x-2 text-sm manrope">
        {['M','T','W','T','F','S','S'].map((d, i) => <span key={`head-${i}`} className="text-stone-500 font-bold text-[10px] uppercase tracking-widest">{d}</span>)}
        
        {gridCells.map((dayNum, i) => {
          if (!dayNum) return <div key={`empty-${i}`} />;
          
          const dateStr = `${year}-${pad(month+1)}-${pad(dayNum)}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDateStr;
          const hasNotes = allNotes[dateStr] && allNotes[dateStr].length > 0;
          
          return (
            <motion.button 
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              whileHover={{ scale: 1.15, rotate: isSelected ? 0 : [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full mx-auto transition-colors duration-300 ${isSelected ? 'text-white' : 'text-stone-300 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'} ${isToday && !isSelected ? 'text-white font-black' : ''}`}
            >
              <span className="relative z-10">{dayNum}</span>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    layoutId="selectedDayIndicator" 
                    className="absolute inset-0 rounded-full z-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]" 
                    style={{ backgroundColor: themeColors.primary }} 
                    transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }} 
                  />
                )}
              </AnimatePresence>
              
              {isToday && !isSelected && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4], boxShadow: [`0 0 0px ${themeColors.primary}00`, `0 0 15px ${themeColors.primary}80`, `0 0 0px ${themeColors.primary}00`] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-transparent z-0" 
                  style={{ borderColor: themeColors.primary, borderStyle: 'solid', borderWidth: '1px' }} 
                />
              )}
              
              {hasNotes && !isSelected && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-300 shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const ActiveDayEditor = ({ selectedDateStr, todayStr, allNotes, addNote, updateNote, themeColors, isGrishma, isShishir }: any) => {
  const notes = allNotes[selectedDateStr] || [];
  const [newNote, setNewNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Safely parse date for header
  const [y, m, d] = selectedDateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const isToday = selectedDateStr === todayStr;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newNote.trim()) {
      addNote(selectedDateStr, newNote);
      setNewNote('');
      triggerSave();
    }
  };

  const handleUpdate = (idx: number, val: string) => {
    updateNote(selectedDateStr, idx, val);
    triggerSave();
  };

  const triggerSave = () => {
    setIsSaved(false);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }, 500)
    );
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 20, stiffness: 200 } }
  };

  return (
    <motion.div 
      key={selectedDateStr} // Force remount for crossfade
      initial={{ opacity: 0, x: -15, filter: 'blur(5px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 15, filter: 'blur(5px)' }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col h-full bg-black/30 p-6 lg:p-8 rounded-[2rem] border border-white/5 border-t-white/10 border-l-white/5 relative backdrop-blur-3xl backdrop-saturate-150 overflow-hidden shadow-2xl transition-all duration-[2s]"
      style={{ boxShadow: '0 20px 100px var(--primary-seasonal-alpha)' }}
    >
      <div className="mb-6 flex justify-between items-start pr-10 shrink-0">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h2 className="noto-serif text-3xl md:text-5xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" style={{ color: themeColors.primary }}>{formattedDate}</h2>
            {isToday && 
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="manrope text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black shadow-lg" 
                style={{ backgroundColor: themeColors.primary, color: '#fff' }}
              >
                Today
              </motion.span>
            }
          </div>
          <p className="text-sm text-stone-400 manrope mt-2 italic tracking-wide opacity-80">Reflect on your intentions, thoughts, and memories.</p>
        </div>
      </div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-5 overflow-y-auto pr-8 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <AnimatePresence>
          {notes.map((note: string, idx: number) => (
            <motion.div 
              variants={itemVariant as any}
              layout
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              key={`${selectedDateStr}-${idx}`} 
              whileHover={{ scale: 1.02, y: -2 }}
              className="group flex items-start bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-t-white/10 hover:border-l-white/10 hover:shadow-[0_10px_30px_var(--primary-seasonal-alpha)] transition-all duration-300 backdrop-blur-md"
            >
              <span className="text-stone-500 manrope text-[10px] uppercase font-black mt-1 mr-4 opacity-50 group-hover:opacity-100 transition-opacity drop-shadow-md" style={{ color: themeColors.primary }}>T {String(idx + 1).padStart(2, '0')}</span>
              <textarea
                className={`bg-transparent border-none focus:outline-none focus:ring-0 w-full text-stone-100 manrope text-sm leading-relaxed resize-none overflow-hidden placeholder:text-stone-700 ${isGrishma ? 'font-light tracking-wide' : isShishir ? 'font-black tracking-tight' : 'font-medium'}`}
                value={note}
                rows={1}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
                onChange={(e) => handleUpdate(idx, e.target.value)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="relative group/input flex items-center bg-black/20 p-5 rounded-2xl border border-white/5 transition-all duration-500 overflow-hidden min-h-[60px]">
          {/* Animated tracing border on focus */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none"
            style={{ background: `conic-gradient(from 0deg, transparent 70%, ${themeColors.primary} 100%)` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-[1.5px] bg-[#121212] rounded-2xl z-0 pointer-events-none transition-colors duration-1000" />
          
          <span className="relative z-10 text-stone-600 manrope text-xl mr-4 font-black transition-all group-focus-within/input:rotate-90 group-focus-within/input:text-white group-focus-within/input:drop-shadow-[0_0_5px_currentColor]">+</span>
          <input
            className={`relative z-10 bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder:text-stone-600 text-stone-200 manrope text-sm m-0 p-0 ${isGrishma ? 'font-light tracking-wide' : isShishir ? 'font-black tracking-tight' : 'font-medium'}`}
            placeholder={notes.length === 0 ? "Breathe deep. Start typing your first thought..." : "Add another focus..."}
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </motion.div>
      
      <SavedIndicator isSaved={isSaved} />
    </motion.div>
  );
};

const SeasonalCalendarUI = () => {
  const { currentSeason, allNotes, addNote, updateNote, themeColors, atmosphere } = useSeasonalCalendar();
  
  const todayDate = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayStr = `${todayDate.getFullYear()}-${pad(todayDate.getMonth()+1)}-${pad(todayDate.getDate())}`;

  // State to hold the actively selected date for the Left Pane
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const formattedFullDate = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const dayNum = todayDate.getDate();
  const quote = currentSeason ? SEASONAL_QUOTES[currentSeason.ritu] : SEASONAL_QUOTES['Vasant'];

  // Animation variants
  const slideUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  // Parallax Mechanics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothOptions = { damping: 40, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, smoothOptions);
  const smoothY = useSpring(mouseY, smoothOptions);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct * 2);
    mouseY.set(yPct * 2);
  };

  const isGrishma = currentSeason?.ritu === 'Grishma';
  const isShishir = currentSeason?.ritu === 'Shishir';

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden relative" onMouseMove={handleMouseMove}>
      {/* Top Section Cinematic Banner */}
      <section 
        className="relative h-[38vh] w-full overflow-hidden mask-wave flex-shrink-0 z-10 transition-shadow duration-[2s]"
        style={{ filter: `drop-shadow(0 -5px 30px ${themeColors.primary}80) drop-shadow(0 15px 40px #000000)` }}
      >
        <LiquidMeshBackground color={themeColors.primary} atmosphere={atmosphere} isGrishma={isGrishma} motionX={smoothX} motionY={smoothY} />
        
        <AmbientParticles />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto h-full px-8 flex justify-between items-center">
          <div className="flex-1 mt-10">
            <motion.p initial="hidden" animate="visible" variants={slideUp} className="text-stone-300/80 mb-2 font-medium tracking-wide text-sm manrope drop-shadow-md">
              {formattedFullDate}
            </motion.p>
            <motion.h1 
              initial="hidden" 
              animate="visible" 
              variants={slideUp} 
              className="noto-serif text-7xl md:text-8xl drop-shadow-[0_5px_40px_var(--primary-seasonal-glow)] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-stone-400 py-2 font-medium"
            >
              {currentSeason?.ritu || 'Vasant'} {todayDate.getFullYear()}
            </motion.h1>
            <motion.p initial="hidden" animate="visible" variants={slideUp} className="manrope text-primary uppercase tracking-[0.3em] text-xs md:text-sm mt-4 font-bold drop-shadow-md">
              {currentSeason?.name || 'Restoration & Renewal'}
            </motion.p>
            <motion.div initial="hidden" animate="visible" variants={slideUp} className="mt-6 max-w-xl">
               <p className="noto-serif italic text-stone-200 text-base leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                 "{quote}"
               </p>
            </motion.div>
          </div>

          <motion.div 
            style={{ 
              x: useTransform(smoothX, [-0.5, 0.5], [15, -15]), 
              y: useTransform(smoothY, [-0.5, 0.5], [15, -15]) 
            }}
            className="rounded-[1.5rem] p-4 max-w-sm shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col gap-2 border-[0.5px] border-t-white/30 border-l-white/20 border-r-white/5 border-b-white/5 hidden lg:flex backdrop-blur-3xl backdrop-saturate-200 bg-white/5 will-change-transform"
          >
            {/* Polaroid Thumbnail */}
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-black/40 ring-1 ring-white/10 shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/60 blur-md scale-110 object-cover opacity-80 mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-color-dodge">
                 <span className="text-[100px] font-serif filter blur-[4px]" style={{ color: themeColors.primary }}>{dayNum}</span>
               </div>
               
               {/* Reflection Glare */}
               <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent skew-y-6 -translate-y-2 transform opacity-30" />
            </div>
            
            <div className="text-center mt-2">
              <h3 className="font-serif text-lg tracking-wide text-white drop-shadow-md">{currentSeason?.name || 'Equinox'}</h3>
              <p className="text-stone-300 text-[9px] manrope uppercase tracking-widest mt-0.5 opacity-60">Sanctuary Memory</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Master-Detail Section */}
      <section className="flex-1 bg-background px-6 lg:px-12 relative z-20 pb-8 pt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-full">
          
          {/* Left Pane: Detail View */}
          <div className="order-2 lg:order-1 h-full min-h-0">
             <ActiveDayEditor 
               selectedDateStr={selectedDateStr}
               todayStr={todayStr}
               allNotes={allNotes}
               addNote={addNote}
               updateNote={updateNote}
               themeColors={themeColors}
               isGrishma={isGrishma}
               isShishir={isShishir}
             />
          </div>

          {/* Right Pane: Master Calendar View */}
          <div className="order-1 lg:order-2">
             <MonthGrid 
               todayDate={todayDate}
               selectedDateStr={selectedDateStr}
               onSelectDate={setSelectedDateStr}
               themeColors={themeColors}
               allNotes={allNotes}
             />
          </div>

        </div>
      </section>
      
      {/* Background SVG Wave mask def with Morphing Geometry */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath clipPathUnits="objectBoundingBox" id="wave-clip">
            <motion.path 
              animate={{
                d: [
                  "M0,0 L1,0 L1,0.85 C0.8,0.95 0.7,0.75 0.5,0.85 C0.3,0.95 0.2,0.8 0,0.9 Z",
                  "M0,0 L1,0 L1,0.9 C0.75,0.8 0.65,1.0 0.5,0.9 C0.3,0.8 0.2,0.95 0,0.85 Z",
                  "M0,0 L1,0 L1,0.8 C0.85,1.0 0.75,0.85 0.5,0.8 C0.3,0.75 0.2,0.9 0,0.95 Z",
                  "M0,0 L1,0 L1,0.85 C0.8,0.95 0.7,0.75 0.5,0.85 C0.3,0.95 0.2,0.8 0,0.9 Z"
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </clipPath>
          <filter id="heat-haze">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default function App() {
  return (
    <SeasonalProvider>
      <SeasonalWrapper>
        <SeasonalCalendarUI />
      </SeasonalWrapper>
    </SeasonalProvider>
  );
}

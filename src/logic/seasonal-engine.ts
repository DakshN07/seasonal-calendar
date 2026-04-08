export interface MicroSeason {
  id: string;
  ritu: string;
  name: string;
  startDayOfYear: number;
}

export const MICRO_SEASONS: MicroSeason[] = [
  // Shishir (Winter) cont. (Jan to mid-Feb)
  { id: 'shishir-3', ritu: 'Shishir', name: 'Late Frost', startDayOfYear: 1 },
  { id: 'shishir-4', ritu: 'Shishir', name: 'Pre-Spring Thaw', startDayOfYear: 25 },
  
  // Vasant (Spring) - mid-Feb to mid-March (Shortened)
  { id: 'vasant-1', ritu: 'Vasant', name: 'First Blossoms', startDayOfYear: 46 }, // ~Mid Feb
  { id: 'vasant-2', ritu: 'Vasant', name: 'Vernal Equinox', startDayOfYear: 60 },
  
  // Grishma (Summer) - mid-March to mid-June (Nagpur Heat)
  { id: 'grishma-1', ritu: 'Grishma', name: 'Rising Heat', startDayOfYear: 74 }, // ~March 15 (April 8 is Day 98 -> Grishma 1)
  { id: 'grishma-2', ritu: 'Grishma', name: 'Scorching Winds', startDayOfYear: 100 }, 
  { id: 'grishma-3', ritu: 'Grishma', name: 'Summer Solstice', startDayOfYear: 135 }, 
  { id: 'grishma-4', ritu: 'Grishma', name: 'Pre-Monsoon Clouds', startDayOfYear: 150 },
  
  // Varsha (Monsoon) - mid-June to mid-September
  { id: 'varsha-1', ritu: 'Varsha', name: 'First Rain', startDayOfYear: 166 }, // ~Mid June
  { id: 'varsha-2', ritu: 'Varsha', name: 'Heavy Downpour', startDayOfYear: 196 },
  { id: 'varsha-3', ritu: 'Varsha', name: 'Verdant Earth', startDayOfYear: 227 },
  { id: 'varsha-4', ritu: 'Varsha', name: 'Retreating Monsoon', startDayOfYear: 243 },
  
  // Sharad (Autumn) - mid-September to mid-November
  { id: 'sharad-1', ritu: 'Sharad', name: 'Clear Skies', startDayOfYear: 258 }, // ~Mid September
  { id: 'sharad-2', ritu: 'Sharad', name: 'Autumn Equinox', startDayOfYear: 273 },
  { id: 'sharad-3', ritu: 'Sharad', name: 'Falling Leaves', startDayOfYear: 288 },
  { id: 'sharad-4', ritu: 'Sharad', name: 'Cooling Nights', startDayOfYear: 304 },
  
  // Hemant (Pre-Winter) - mid-November to mid-December
  { id: 'hemant-1', ritu: 'Hemant', name: 'First Chill', startDayOfYear: 319 }, // ~Mid November
  { id: 'hemant-2', ritu: 'Hemant', name: 'Morning Mist', startDayOfYear: 334 },
  
  // Shishir (Winter) - mid-December to end-of-year
  { id: 'shishir-1', ritu: 'Shishir', name: 'Winter Solstice', startDayOfYear: 349 }, // ~Mid Dec
  { id: 'shishir-2', ritu: 'Shishir', name: 'Deep Frost', startDayOfYear: 365 } // Overflow handling
];

/**
 * Returns the current day of the year (1-365/366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Identifies the current Indian micro-season based on the date.
 */
export function getCurrentMicroSeason(date: Date): MicroSeason {
  const dayOfYear = getDayOfYear(date);
  
  let currentSeason = MICRO_SEASONS[0];
  for (let i = 0; i < MICRO_SEASONS.length; i++) {
    if (dayOfYear >= MICRO_SEASONS[i].startDayOfYear) {
      currentSeason = MICRO_SEASONS[i];
    } else {
      break;
    }
  }
  return currentSeason;
}

/**
 * Calculates transition states, specifically the March Shishir -> Vasant shift.
 */
export function getTransitionState(date: Date): boolean {
  // We define the March transition (Winter to Summer shift) as occurring
  // roughly when entering Vasant-1 (Day ~74, Mid March).
  // We trigger isTransitioning true for a 3-day window specifically during this shift.
  const dayOfYear = getDayOfYear(date);
  const vasantStart = 74; // Vernal Equinox phase map 
  return dayOfYear >= vasantStart && dayOfYear <= vasantStart + 3;
}

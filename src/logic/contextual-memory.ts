export interface DailyNotes {
  dateStr: string; // "YYYY-MM-DD"
  notes: string[];
}

const STORAGE_KEY = 'seasonal_daily_notes';

export function getAllNotes(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveAllNotes(data: Record<string, string[]>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getNotesForDate(date: Date): string[] {
  const dateStr = date.toISOString().split('T')[0];
  const allNotes = getAllNotes();
  return allNotes[dateStr] || [];
}

export function addNoteForDate(dateStr: string, text: string) {
  if (!text.trim()) return;
  const allNotes = getAllNotes();
  if (!allNotes[dateStr]) {
    allNotes[dateStr] = [];
  }
  allNotes[dateStr].push(text.trim());
  saveAllNotes(allNotes);
}

export function updateNoteForDate(dateStr: string, index: number, text: string) {
  const allNotes = getAllNotes();
  if (!allNotes[dateStr] || index >= allNotes[dateStr].length) return;
  
  if (text.trim() === '') {
    allNotes[dateStr].splice(index, 1);
  } else {
    allNotes[dateStr][index] = text;
  }
  saveAllNotes(allNotes);
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

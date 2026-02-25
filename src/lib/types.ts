export type DailyEntry = {
  id: number;
  date: string; // YYYY-MM-DD
  seenCount: number;
  noShowCount: number;
};

export type DailyWithStats = DailyEntry & {
  total: number;
  rate: number;
  noShowRate: number;
};

export type WeeklyWithStats = {
  key: string;
  year: number;
  week: number;
  totalSeen: number;
  totalNoShow: number;
  firstDate: string;
  lastDate: string;
  total: number;
  rate: number;
  noShowRate: number;
};

export type RollingPoint = {
  date: string;
  rate: number;
};

export type Stats = {
  daily: DailyWithStats[];
  weekly: WeeklyWithStats[];
  totalSeen: number;
  totalNoShow: number;
  totalPatients: number;
  globalRate: number;
  globalNoShowRate: number;
  avgSeenPerDay: number;
  avgNoShowPerDay: number;
  daysWithoutNoShow: number;
  bestWeek?: WeeklyWithStats;
  worstWeek?: WeeklyWithStats;
  rolling7Days: RollingPoint[];
};

export type Period = "30" | "60" | "all";

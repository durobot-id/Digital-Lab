import { UserOverallProgress, TopicProgress } from "@/types";

const PROGRESS_KEY = "dilsa_student_progress_v1";
const PROFILE_KEY = "dilsa_student_profile_v1";
const SETTINGS_KEY = "dilsa_student_settings_v1";

export interface UserProfile {
  name: string;
  classGrade: string;
  school: string;
  bio: string;
  avatarInitials: string;
  streakDays: number;
  learningHours: number;
  experimentsCompletedCount: number;
  badges: {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    category: string;
  }[];
}

export interface UserSettings {
  soundEnabled: boolean;
  animationSpeed: "normal" | "fast" | "reduced";
  aiPromptStyle: "socratic" | "direct" | "detailed";
  customApiKey: string;
  highContrast: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Raka Aditya",
  classGrade: "Kelas VIII-A SMP",
  school: "SMP Negeri 1 Surabaya",
  bio: "Siswa pecinta eksperimen fisika dan elektronika.",
  avatarInitials: "RA",
  streakDays: 7,
  learningHours: 4.5,
  experimentsCompletedCount: 2,
  badges: [
    {
      id: "b1",
      title: "Penemu Sirkuit Listrik",
      description: "Menyelesaikan simulasi rangkaian tertutup dan menghitung Hukum Ohm.",
      unlocked: true,
      category: "Kelistrikan"
    },
    {
      id: "b2",
      title: "Master Gaya & Percepatan",
      description: "Membuktikan rumus Hukum II Newton dengan variasi beban dan massa.",
      unlocked: true,
      category: "Mekanika"
    },
    {
      id: "b3",
      title: "Pakar Cermin Datar",
      description: "Mengukur kesamaan sudut datang dan pantul menggunakan busur derajat.",
      unlocked: true,
      category: "Optika"
    },
    {
      id: "b4",
      title: "Peneliti Tanpa Henti",
      description: "Menjaga streak belajar selama 7 hari berturut-turut.",
      unlocked: true,
      category: "Konsistensi"
    },
    {
      id: "b5",
      title: "Sempurna Kuis Sains",
      description: "Mendapatkan nilai 100% pada evaluasi pemahaman materi.",
      unlocked: false,
      category: "Prestasi"
    }
  ]
};

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  animationSpeed: "normal",
  aiPromptStyle: "socratic",
  customApiKey: "",
  highContrast: false
};

// PROGRESS
export function getStoredProgress(): UserOverallProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      // default mock initial state if empty
      const initial: UserOverallProgress = {
        "gaya-dan-gerak": {
          materialCompleted: true,
          labCompleted: true,
          quizScore: 5,
          quizTotal: 6,
          quizPercentage: 83,
          quizDate: "20/10/2026"
        },
        "kelistrikan": {
          materialCompleted: true,
          labCompleted: true,
          quizScore: 6,
          quizTotal: 6,
          quizPercentage: 100,
          quizDate: "21/10/2026"
        },
        "cahaya-dan-optik": {
          materialCompleted: true,
          labCompleted: false,
          quizScore: 4,
          quizTotal: 6,
          quizPercentage: 67,
          quizDate: "19/10/2026"
        }
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function getTopicProgress(slug: string): TopicProgress {
  const all = getStoredProgress();
  return (
    all[slug] || {
      materialCompleted: false,
      labCompleted: false
    }
  );
}

export function saveTopicProgress(slug: string, updates: Partial<TopicProgress>): TopicProgress {
  if (typeof window === "undefined") {
    return { materialCompleted: false, labCompleted: false, ...updates };
  }
  try {
    const all = getStoredProgress();
    const current = all[slug] || { materialCompleted: false, labCompleted: false };
    const updated: TopicProgress = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    all[slug] = updated;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("dilsa_storage_updated"));
    return updated;
  } catch (e) {
    return { materialCompleted: false, labCompleted: false, ...updates };
  }
}

// PROFILE
export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(updates: Partial<UserProfile>): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const current = getUserProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("dilsa_profile_updated"));
    return updated;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

// SETTINGS
export function getUserSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(updates: Partial<UserSettings>): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const current = getUserSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("dilsa_settings_updated"));
    return updated;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function resetAllData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    window.dispatchEvent(new Event("dilsa_storage_updated"));
    window.dispatchEvent(new Event("dilsa_profile_updated"));
  } catch (e) {}
}

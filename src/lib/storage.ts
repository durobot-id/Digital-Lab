import { UserOverallProgress, TopicProgress } from "@/types";

const STORAGE_KEY = "dilsa_student_progress_v1";

export function getStoredProgress(): UserOverallProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read progress from storage", e);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  } catch (e) {
    console.error("Failed to save progress to storage", e);
    return { materialCompleted: false, labCompleted: false, ...updates };
  }
}

export function resetTopicProgress(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getStoredProgress();
    delete all[slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to reset topic progress", e);
  }
}

export function resetAllProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear progress", e);
  }
}

// stores/feedStore.ts
import { create } from "zustand";

interface FeedStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  activeTab: "all",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
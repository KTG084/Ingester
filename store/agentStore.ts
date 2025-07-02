import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Agents } from "@prisma/client";

type Store = {
  agents: Agents[] | null;
  setagents: (agents: Agents[]) => void;
  loading: boolean;
  setLoading: (state: boolean) => void;
  clearAgents: () => void;
};

export const useAgentStore = create<Store>()(
  persist(
    (set) => ({
      agents: null,
      loading: false,
      setagents: (agents) => set({ agents }),
      setLoading: (state) => set({ loading: state }),
      clearAgents: () => set({ agents: null }),
    }),
    {
      name: "Agent Storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
// useCourseStore.getState().clearCourse();

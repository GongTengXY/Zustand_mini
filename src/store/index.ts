import { create } from '../zustand_mini'

interface BearState {
  count: number
  increase: (by?: number) => void
  decrease: (by?: number) => void
  reset: () => void
}

export const useBearStore = create<BearState>((set) => ({
  count: 1,
  increase: (by = 1) => set((state) => ({ count: state.count + by })),
  decrease: (by = 1) => set((state) => ({ count: state.count - by })),
  reset: () => set({ count: 1 }),
}))

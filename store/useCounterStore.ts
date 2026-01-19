import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
}

export const useCounterStore = create<CounterState>()(
    persist(
        (set) => ({
            count: 0,
            increment: () => set((state) => ({ count: state.count + 1 })),
            decrement: () => set((state) => ({ count: state.count - 1 })),
        }),
        {
            name: 'counter-storage', // localStorage 的 key
            storage: createJSONStorage(() => localStorage),
        }
    )
);

import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  mode: "login" | "signup";
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  mode: "login",
  onOpenLogin: () => set({ isOpen: true, mode: "login" }),
  onOpenSignup: () => set({ isOpen: true, mode: "signup" }),
  onClose: () => set({ isOpen: false }),
}));

export default useAuthModal;

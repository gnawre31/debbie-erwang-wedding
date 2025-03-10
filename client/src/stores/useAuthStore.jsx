import { create } from "zustand";
import Cookies from "js-cookie";

const EXPIRY_DATE = 60
const PASSWORD = "test"

const useAuthStore = create((set) => ({


    isAuthenticated: !!Cookies.get("auth"),
    login: (password) => {
        if (password === PASSWORD) {
            Cookies.set("auth", "true", { expires: EXPIRY_DATE });
            set({ isAuthenticated: true });
        }
    },
    logout: () => {
        Cookies.remove("auth");
        set({ isAuthenticated: false });
    }
}));

export default useAuthStore;

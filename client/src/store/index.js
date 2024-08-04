import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";

export const useAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
}))
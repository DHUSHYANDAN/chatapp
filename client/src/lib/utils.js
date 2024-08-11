import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
    "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
    "bg-green-900 text-green-400 border-[1px] border-[#0d6a0bb]",
    "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
    if (color >= 0 && color < colors.length) {
        return colors[color];
    }
    return colors[0]; 
};

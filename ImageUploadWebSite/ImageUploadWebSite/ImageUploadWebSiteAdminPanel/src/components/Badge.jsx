import React from "react";

/**
 * Lightweight badge component
 * usage: <Badge tone="green">Active</Badge>
 */
export default function Badge({ children, tone = "blue", className = "" }) {
    const toneMap = {
        blue: "bg-blue-600",
        green: "bg-green-600",
        red: "bg-red-600",
        yellow: "bg-yellow-500",
        gray: "bg-gray-500",
        indigo: "bg-indigo-600",
        purple: "bg-purple-600",
    };
    const color = toneMap[tone] || toneMap.blue;
    return (
        <span className={`text-xs px-2 py-1 rounded-full text-white ${color} ${className}`}>
            {children}
        </span>
    );
}

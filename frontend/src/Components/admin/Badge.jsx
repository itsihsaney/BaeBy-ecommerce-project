import React from 'react';

export default function Badge({ type, children }) {
    const getBadgeStyles = () => {
        switch (type) {
            case 'admin':
                return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
            case 'user':
                return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'active':
                return 'bg-green-500/10 text-green-400 border border-green-500/20';
            case 'inactive':
                return 'bg-red-500/10 text-red-400 border border-red-500/20';
            case 'delivered':
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'paid':
                return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'cancelled':
                return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            case 'pending':
            case 'pending cod':
                return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
        }
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap inline-block ${getBadgeStyles()}`}>
            {children}
        </span>
    );
}

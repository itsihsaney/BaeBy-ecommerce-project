import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, icon: Icon, children }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-lg bg-[#0F0F12] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 overflow-hidden my-8"
                >
                    {/* Subtle Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        {Icon && (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-lg">
                                <Icon size={20} />
                            </div>
                        )}
                        <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
                    </div>

                    <div className="relative z-10">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

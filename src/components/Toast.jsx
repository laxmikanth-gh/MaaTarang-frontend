import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-teal-500" />,
  };

  const bgColors = {
    success: "bg-emerald-50/90 border-emerald-200 text-emerald-900",
    error: "bg-rose-50/90 border-rose-200 text-rose-900",
    info: "bg-teal-50/90 border-teal-200 text-teal-900",
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border backdrop-blur-md pointer-events-auto min-w-[280px] max-w-sm ${bgColors[type]}`}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <p className="text-sm font-medium flex-grow">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

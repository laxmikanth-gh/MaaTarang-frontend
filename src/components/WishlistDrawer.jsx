import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";

export default function WishlistDrawer({ isOpen, onClose, wishlist = [], onRemoveFromWishlist }) {
  const WHATSAPP_NUMBER = "917780646402";

  const handleOrderAll = () => {
    if (wishlist.length === 0) return;
    const names = wishlist.map((item) => item.name).join(", ");
    const text = encodeURIComponent(
      `Hello MaaTarang, I am interested in buying the following handcrafted designs from my wishlist:\n\n${names}\n\nPlease let me know the customization options and delivery details.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-teal-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-current text-gold-accent" />
                  <h3 className="font-serif text-xl font-bold tracking-wide">My Wishlist</h3>
                  <span className="bg-teal-700 text-gold-accent text-xs font-semibold px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
                    <div className="p-4 bg-amber-50 rounded-full">
                      <Heart className="w-12 h-12 text-teal-700/60" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-800">Your wishlist is empty</h4>
                      <p className="text-sm text-slate-500 mt-2 max-w-xs">
                        Add your favorite traditional embroideries and maggam designs here to keep track of them.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-sm font-semibold bg-teal-700 text-white px-5 py-2.5 rounded-lg hover:bg-teal-800 transition-colors"
                    >
                      Browse Designs
                    </button>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover bg-white rounded-lg border border-slate-100 flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-slate-800 truncate text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                        <p className="text-teal-700 font-bold text-sm mt-2">₹{item.price}/-</p>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <button
                          onClick={() => onRemoveFromWishlist(item._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                            `Hello MaaTarang, I am interested in customizing and buying this design: ${item.name} (₹${item.price}/-)`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          Order
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {wishlist.length > 0 && (
                <div className="border-t border-slate-100 p-6 space-y-3 bg-slate-50/50">
                  <div className="flex justify-between items-center text-slate-600 text-sm">
                    <span>Selected Items</span>
                    <span className="font-semibold text-slate-900">{wishlist.length} items</span>
                  </div>
                  <button
                    onClick={handleOrderAll}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Order All via WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

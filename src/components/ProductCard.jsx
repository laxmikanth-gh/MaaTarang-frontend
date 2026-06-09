import React from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, MessageSquare } from "lucide-react";

export default function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  isAdmin = false,
  onDeleteProduct,
  isLoggedIn = false,
  onOpenLogin,
}) {
  const WHATSAPP_NUMBER = "917780646402";

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenLogin();
    } else {
      onToggleWishlist(product._id);
    }
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello MaaTarang, I am interested in ordering this design:\n\n*${product.name}*\nCategory: ${product.category}\nPrice: ₹${product.price}/-\n\nProduct Link: ${product.image}`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 flex flex-col h-full transition-all duration-300 relative"
    >
      {/* Product Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Action Overlays */}
        <div className="absolute top-4 right-4 flex flex-col gap-2.5">
          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlistClick}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-white/80 hover:bg-white text-slate-500 hover:text-rose-500"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          </motion.button>

          {/* Admin Delete Button */}
          {isAdmin && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                  onDeleteProduct(product._id);
                }
              }}
              className="p-2.5 rounded-full bg-white/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 shadow-md backdrop-blur-md transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-teal-800/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-teal-700 transition-colors">
          {product.name}
        </h3>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-teal-800 font-sans">₹{product.price}/-</span>
        </div>

        <div className="mt-auto pt-5">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md group-hover:bg-emerald-600"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

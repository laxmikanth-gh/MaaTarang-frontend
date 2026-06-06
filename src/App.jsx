import { useEffect, useState } from "react";
import logo from "./assets/logo.png";

const API_URL = "https://maatarang-backend.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
 useEffect(() => {
  const loadProducts = () => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTimeout(loadProducts, 3000);
      });
  };

  loadProducts();
}, []);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-teal-800">
        Loading Products...
      </h1>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-amber-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow">

        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="MaaTarang Logo"
            className="h-16 w-16 object-contain"
          />

          <div>
            <h1 className="text-3xl font-bold text-teal-800">
              MaaTarang
            </h1>

            <p className="text-sm text-gray-500">
              Where Tradition Meets Artistry
            </p>
          </div>
        </div>

        <div className="space-x-6 text-gray-700 hidden md:block">
          <a href="#" className="hover:text-teal-700">Home</a>
          <a href="#about" className="hover:text-teal-700">About</a>
          <a href="#contact" className="hover:text-teal-700">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6">

        <h2 className="text-6xl font-bold text-teal-800">
          Handcrafted Elegance
        </h2>

        <p className="mt-4 text-2xl text-gray-700">
          Traditional Embroidery • Maggam Work • Custom Designs
        </p>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
          Discover handcrafted embroidery, designer tailoring,
          maggam work, and custom creations crafted with
          precision, creativity, and love.
        </p>

        <div className="mt-8">
          <a
            href="https://wa.me/917780646402"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
              Order on WhatsApp
            </button>
          </a>
        </div>

      </section>

      {/* Featured Products */}
      <section className="py-10 px-6">

        <h2 className="text-4xl font-bold text-center text-teal-800 mb-10">
          Featured Designs
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >

              <img
                src={`${API_URL}${product.image}`}
                alt={product.name}
                className="w-full h-96 object-contain bg-white"
              />

              <div className="p-6">

                <h3 className="text-2xl font-semibold">
                  {product.name}
                </h3>

                <p className="text-gray-600 mt-3">
                  Category: {product.category}
                </p>

                <p className="text-3xl font-bold text-teal-700 mt-5">
                  ₹{product.price}/-
                </p>

                <a
                  href={`https://wa.me/917780646402?text=Hello MaaTarang, I am interested in ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                    Order on WhatsApp
                  </button>
                </a>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-10 bg-white mt-16"
      >

        <div className="max-w-4xl mx-auto text-center">

          <img
            src={logo}
            alt="MaaTarang"
            className="h-24 mx-auto mb-6"
          />

          <h2 className="text-4xl font-bold text-teal-800 mb-6">
            About MaaTarang
          </h2>

          <p className="text-gray-600 text-lg">
            MaaTarang celebrates traditional craftsmanship through
            handcrafted embroidery, maggam work, designer blouses,
            and custom tailoring. Every creation reflects artistry,
            passion, and timeless elegance.
          </p>

        </div>

      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-teal-800 text-white text-center py-10"
      >

        <img
          src={logo}
          alt="MaaTarang Logo"
          className="h-20 mx-auto mb-4"
        />

        <h3 className="text-3xl font-bold">
          MaaTarang
        </h3>

        <p className="mt-2">
          Where Tradition Meets Artistry
        </p>

        <p className="mt-4">
          WhatsApp: +91 7780646402
        </p>

        <p className="mt-6 text-sm">
          © 2026 MaaTarang. All Rights Reserved.
        </p>

      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917780646402"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-600"
      >
        WhatsApp Us
      </a>

    </div>
  );
}

export default App;

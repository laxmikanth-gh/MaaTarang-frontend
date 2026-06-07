import { useEffect, useState, useRef, useCallback } from "react";
import logo from "./assets/logo.png";

const API_URL = "https://maatarang-backend.onrender.com";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((r) => r.json())
      .then((d) => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const doLogin = () => {
    if (password === "Bunny@MaaTarang") {
      setIsAdmin(true); setShowAdmin(false); setPassword("");
    } else {
      alert("Incorrect password.");
    }
  };

  if (loading) return <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FAF7F2"}}>Loading...</div>;

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh", paddingBottom: "50px" }}>
      {/* Navbar */}
      <nav style={{ padding: "20px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", position: "sticky", top: 0, zIndex: 1000 }}>
        <img src={logo} alt="Logo" style={{ width: "50px" }} />
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#home">Home</a>
          <a href="#products">Collection</a>
          <button onClick={() => setShowAdmin(true)}>Admin</button>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1>MaaTarang</h1>
        <p>Where Tradition Meets Artistry</p>
      </section>

      {/* Admin Panel */}
      {isAdmin && (
        <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc" }}>
          <h2>Admin Dashboard</h2>
          <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ display: "block", marginBottom: "10px" }} />
          <input type="number" placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ display: "block", marginBottom: "10px" }} />
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} style={{ display: "block", marginBottom: "10px" }} />
          <button onClick={async () => {
            setUploading(true);
            const fd = new FormData(); fd.append("image", imageFile);
            const res = await fetch(`${API_URL}/upload`, { method: "POST", body: fd });
            const data = await res.json();
            await fetch(`${API_URL}/products`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: newName, price: newPrice, category: newCategory, image: data.imageUrl })
            });
            window.location.reload();
          }}>{uploading ? "Uploading..." : "Add Product"}</button>
        </div>
      )}

      {/* Products Grid */}
      <section id="products" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
        {products.map(p => (
          <div key={p._id} style={{ border: "1px solid #ddd", padding: "15px" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%" }} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <a href={`https://wa.me/917780646402?text=I want to buy ${p.name}`} target="_blank" rel="noreferrer">Order on WhatsApp</a>
          </div>
        ))}
      </section>

      {/* Auth Modal */}
      {showAdmin && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "white", padding: "20px" }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={doLogin}>Login</button>
            <button onClick={() => setShowAdmin(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

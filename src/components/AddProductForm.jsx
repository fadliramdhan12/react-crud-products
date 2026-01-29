import { useState, useEffect } from "react";
import { addProduct, getCategories } from "../api/productApi";

export default function AddProduct({ onAdd }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      // Jika API return array string atau object, sesuaikan
      if (typeof res.data[0] === "object") {
        setCategories(res.data);
        setCategory(res.data[0].name || res.data[0].slug);
      } else {
        setCategories(res.data.map((c) => ({ name: c, slug: c })));
        setCategory(res.data[0]);
      }
    } catch {
      alert("Gagal load category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) return alert("Title & Price wajib");

    try {
      const res = await addProduct({
        title,
        price: Number(price),
        description: "New Product",
        category, // string
      });

      const newProduct = {
        ...res.data,
        category: typeof res.data.category === "object" ? res.data.category.name : res.data.category,
      };

      onAdd(newProduct);
      setTitle("");
      setPrice("");
    } catch {
      alert("Gagal tambah product");
    }
  };

  return (
    <div className="form-section">
      <h3>Add Product</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => {
            const val = e.target.value;
            if (!val.includes("-")) setPrice(val);
          }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c, i) => (
            <option key={i} value={c.name || c.slug}>
              {c.name || c.slug}
            </option>
          ))}
        </select>
        <button type="submit" style={{ marginLeft: "10px" }}>Add Product</button>
      </form>
    </div>
  );
}

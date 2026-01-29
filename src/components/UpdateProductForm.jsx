import { useState, useEffect } from "react";
import { updateProduct, getCategories } from "../api/productApi";

export default function UpdateProduct({ product, onUpdate, onCancel }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price);
      setCategory(product.category);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (typeof res.data[0] === "object") {
        setCategories(res.data);
      } else {
        setCategories(res.data.map((c) => ({ name: c, slug: c })));
      }
    } catch {
      alert("Gagal load category");
    }
  };

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(product.id, {
        title,
        price: Number(price),
        category,
      });

      const updatedProduct = {
        ...res.data,
        category: typeof res.data.category === "object" ? res.data.category.name : res.data.category,
      };

      onUpdate(updatedProduct);
    } catch {
      alert("Gagal update product");
    }
  };

  return (
    <div className="form-section">
      <h3>Update Product</h3>
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
        <button type="submit">Update Product</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

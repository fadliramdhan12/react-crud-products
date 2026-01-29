import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/productApi";
import AddProduct from "./AddProductForm";
import UpdateProduct from "./UpdateProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.products);
    } catch {
      alert("Gagal load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("hapus?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Gagal hapus product");
    }
  };

  return (
    <div className="container">
      <h1>Product List</h1>

      <AddProduct onAdd={handleAdd} />

      <UpdateProduct
        product={selectedProduct}
        onUpdate={handleUpdate}
        onCancel={() => setSelectedProduct(null)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th width="200">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.category}</td>
                <td>
                  <button onClick={() => setSelectedProduct(p)}>Edit</button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: "5px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

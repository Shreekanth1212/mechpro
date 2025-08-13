
import { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "../product/ProductList";
import ProductDetailPage from "../product/ProductDetailPage";
import FieldDetailPage from "../product/FieldDetailPage";
const MemberDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [selectedFieldForDetail, setSelectedFieldForDetail] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSaveProduct = async (productData) => {
    if (productData._id) {
      const updatedProduct = await axios.put(`/api/products/${productData._id}`, productData);
      setProducts(prevProducts => prevProducts.map(p => (p._id === updatedProduct.data._id ? updatedProduct.data : p)));
    } else {
      const newProduct = await axios.post('/api/products', productData);
      setProducts(prevProducts => [...prevProducts, newProduct.data]);
    }
    return true;
  };

  const handleAddField = async (productId, fieldName) => {
    const response = await axios.post(`/api/products/${productId}/fields`, { name: fieldName });
    const updatedProductFromServer = response.data;
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? updatedProductFromServer : product
      )
    );
    setSelectedProductForDetail(updatedProductFromServer);
    return true;
  };

  const handleAddSubfield = async (productId, fieldId, formData) => {
    const response = await axios.post(`/api/products/${productId}/fields/${fieldId}/subfields`, formData);
    const updatedProductFromServer = response.data;
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? updatedProductFromServer : product
      )
    );
    setSelectedFieldForDetail(updatedProductFromServer.fields.find(f => f._id === fieldId));

    return true;
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDeleteModal = document.createElement('div');
    confirmDeleteModal.className = "fixed inset-0 bg-black/50 flex justify-center items-center z-50";
    confirmDeleteModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete this product?</p>
        <div class="flex justify-around gap-4">
          <button id="cancelDelete" class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300">
            Cancel
          </button>
          <button id="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300">
            Delete
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmDeleteModal);

    return new Promise(resolve => {
      document.getElementById('confirmDelete').onclick = async () => {
        document.body.removeChild(confirmDeleteModal);
        await axios.delete(`/api/products/${productId}`);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        console.log('Product deleted:', productId);
        resolve(true);
      };
      document.getElementById('cancelDelete').onclick = () => {
        document.body.removeChild(confirmDeleteModal);
        resolve(false);
      };
    });
  };

  return (
    <>

      {!selectedProductForDetail && (
        <ProductList
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          selectedProductToEdit={selectedProductToEdit}
          setSelectedProductToEdit={setSelectedProductToEdit}
          onViewProductDetails={(product) => {
            setSelectedProductForDetail(product);
          }}
        />
      )}
      {selectedProductForDetail && !selectedFieldForDetail && (
        <ProductDetailPage
          product={selectedProductForDetail}
          onAddField={handleAddField}
          onBackToProducts={() => setSelectedProductForDetail(null)}
          onSelectField={(field) => setSelectedFieldForDetail(field)}
        />
      )}
      {selectedProductForDetail && selectedFieldForDetail && (
        <FieldDetailPage
          product={selectedProductForDetail}
          field={selectedFieldForDetail}
          onAddSubfield={handleAddSubfield}
          onBackToProductDetail={() => setSelectedFieldForDetail(null)}
        />
      )}
    </>
  );
};

export default MemberDashboard;
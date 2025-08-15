
import { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "../product/ProductList";
import ProductDetailPage from "../product/ProductDetailPage";
import FieldDetailPage from "../product/FieldDetailPage";
import ProductReviewPage from "../product/ProductReviewPage";

import jsPDF from "jspdf";

const MemberDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [selectedFieldForDetail, setSelectedFieldForDetail] = useState(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

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
  const handleSaveReviewImage = async (productId, fieldId, subfieldId, imageId, formData) => {
    const response = await axios.post(`/api/products/${productId}/fields/${fieldId}/subfields/${subfieldId}/images/${imageId}/review`, formData);
    const updatedProductFromServer = response.data;
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? updatedProductFromServer : product
      )
    );
    setSelectedProductForReview(updatedProductFromServer);
    return true;
  };

  const downloadSelectedProduct = (product) => {
    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleString();
      } catch {
        return "N/A";
      }
    };
    const timestamp = Date.now();
    const fileName = `${(product.name || "product").replace(/\s+/g, "_")}_${timestamp}.pdf`;

    let htmlContent = `
    <html>
      <head>
        <title>${product.name || "Product"}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background: white;
            color: #333;
          }
          h1 {
            font-size: 26px;
            margin-bottom: 5px;
            color: #007BFF;
          }
          p {
            font-size: 14px;
            margin: 4px 0 12px 0;
          }
          h2 {
            font-size: 20px;
            margin-top: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
            color: #444;
          }
          h3 {
            font-size: 16px;
            margin-top: 10px;
            color: #555;
          }
          .subfield {
            margin-left: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 6px;
            margin-top: 8px;
          }
          .image-row {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }
          .image-box {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 5px;
            background: #fff;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }
          .image-box h4 {
            font-size: 13px;
            margin: 4px 0;
            font-weight: bold;
            color: #666;
          }
          .image-box img {
            max-width: 100%;
            max-height: 140px;
            border-radius: 4px;
            object-fit: contain;
          }
          .empty-box {
            width: 100%;
            height: 140px;
            background: #f2f2f2;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: #aaa;
            border-radius: 4px;
          }
          @media print {
            body { padding: 0; }
            h1, h2, h3, h4 { color: black; }
          }
        </style>
      </head>
      <body>
        <h1>${product.name || "Unnamed Product"}</h1>
        <p><strong>Description:</strong> ${product.description || "N/A"}</p>
        <p><strong>Created At:</strong> ${formatDate(product.createdAt)}</p>
        <p><strong>Updated At:</strong> ${formatDate(product.updatedAt)}</p>
  `;

    if (product.fields) {
      for (const field of product.fields) {
        htmlContent += `<h2>Field: ${field.name}</h2>`;

        for (const subfield of field.subfields || []) {
          htmlContent += `
          <div class="subfield">
            <h3>Subfield: ${subfield.name}</h3>
            <p><strong>Description:</strong> ${subfield.description || "N/A"}</p>
        `;

          let imgIndex = 1;
          for (const imgObj of subfield.images || []) {
            htmlContent += `
            <div class="image-row">
              <div class="image-box">
                <h4>Defect Image ${imgIndex}</h4>
                ${imgObj.image
                ? `<img src="${imgObj.image}" alt="Defect Image ${imgIndex}" 
                           onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\'empty-box\'>Image Not Available</div>'" />`
                : `<div class="empty-box">Image Not Available</div>`
              }
              </div>
              <div class="image-box">
                <h4>Review Image ${imgIndex}</h4>
                ${imgObj.reviewImage
                ? `<img src="${imgObj.reviewImage}" alt="Review Image ${imgIndex}" 
                           onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\'empty-box\'>Image Not Available</div>'" />`
                : `<div class="empty-box">Image Not Available</div>`
              }
              </div>
            </div>
          `;
            imgIndex++;
          }

          htmlContent += `</div>`;
        }
      }
    }

    htmlContent += `
      <script>
        window.onload = function() {
          document.title = "${fileName}"; 
          window.print();
        };
      </script>
    </body>
  </html>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

      {!selectedProductForDetail && !selectedProductForReview && (
        <ProductList
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          selectedProductToEdit={selectedProductToEdit}
          setSelectedProductToEdit={setSelectedProductToEdit}
          onViewProductDetails={(product) => {
            setSelectedProductForDetail(product);
          }}
          onReviewProduct={(product) => {
            setSelectedProductForReview(product);
          }}
          onDownloadProduct={(product) => {
            downloadSelectedProduct(product);
          }}
        />
      )}
      {selectedProductForDetail && !selectedFieldForDetail && !selectedProductForReview && (
        <ProductDetailPage
          product={selectedProductForDetail}
          onAddField={handleAddField}
          onBackToProducts={() => setSelectedProductForDetail(null)}
          onSelectField={(field) => setSelectedFieldForDetail(field)}
        />
      )}
      {selectedProductForDetail && selectedFieldForDetail && !selectedProductForReview && (
        <FieldDetailPage
          product={selectedProductForDetail}
          field={selectedFieldForDetail}
          onAddSubfield={handleAddSubfield}
          onBackToProductDetail={() => setSelectedFieldForDetail(null)}
        />
      )}
      {selectedProductForReview && (
        <ProductReviewPage
          product={selectedProductForReview}
          onSaveReviewImage={handleSaveReviewImage}
          onBackToProducts={() => setSelectedProductForReview(null)}
        />
      )}
    </>
  );
};

export default MemberDashboard;
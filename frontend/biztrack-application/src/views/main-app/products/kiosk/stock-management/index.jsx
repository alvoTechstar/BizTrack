// StockManagementPage.jsx
import React, { useState, useEffect } from "react";
import StockSummaryCards from "./StockSummaryCards";
import ProductControls from "./ProductControls";
import ProductsTable from "./ProductsTable";
import EditProductModal from "./EditProductsModal";
import RestockProductModal from "./RestockProductModal";
import DeleteConfirmationModal from "../../../../../components/modal/DeleteConfirmationModal";
import AddNewProductModal from "./AddNewProductModal";
import ContentLoader from "../../../../../components/Loader/ContentLoader";
import { useTheme } from "../../../../../components/theme/ThemeContext";

export default function StockManagementPage() {
  const { primaryColor } = useTheme();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Coffee Beans",
      sku: "PCB001",
      category: "Beverages",
      stock: 45,
      unit: "kg",
      buyingPrice: 2400.0,
      price: 2999.0,
      threshold: 10,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Organic Green Tea",
      sku: "OGT002",
      category: "Beverages",
      stock: 8,
      unit: "boxes",
      buyingPrice: 1080.0,
      price: 1500.0,
      threshold: 15,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Whole Wheat Flour",
      sku: "WWF003",
      category: "Baking",
      stock: 25,
      unit: "kg",
      buyingPrice: 360.0,
      price: 479.0,
      threshold: 20,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Stainless Steel Mug",
      sku: "SSM004",
      category: "Kitchenware",
      stock: 32,
      unit: "pieces",
      buyingPrice: 1800.0,
      price: 2250.0,
      threshold: 10,
      status: "In Stock",
    },
    {
      id: 5,
      name: "Cotton Dish Towels",
      sku: "CDT005",
      category: "Home",
      stock: 54,
      unit: "pieces",
      buyingPrice: 720.0,
      price: 959.0,
      threshold: 20,
      status: "In Stock",
    },
    {
      id: 6,
      name: "Eco-friendly Detergent",
      sku: "EFD006",
      category: "Cleaning",
      stock: 0,
      unit: "bottles",
      buyingPrice: 900.0,
      price: 1199.0,
      threshold: 5,
      status: "Out of Stock",
    },
    {
      id: 7,
      name: "Artisanal Chocolate",
      sku: "ACH007",
      category: "Confectionery",
      stock: 18,
      unit: "bars",
      buyingPrice: 480.0,
      price: 660.0,
      threshold: 15,
      status: "In Stock",
    },
    {
      id: 8,
      name: "Scented Candles",
      sku: "SCA008",
      category: "Home",
      stock: 7,
      unit: "pieces",
      buyingPrice: 1320.0,
      price: 1710.0,
      threshold: 10,
      status: "Low Stock",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedItems, setSelectedItems] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Content Loader states
  const [loading, setLoading] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [loadedText, setLoadedText] = useState("");

  // Modal loading states
  const [modalLoading, setModalLoading] = useState(false);
  const [modalLoadingText, setModalLoadingText] = useState("");

  // Operation loading states
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationLoadingText, setOperationLoadingText] = useState("");

  const categories = [...new Set(products.map((product) => product.category))];

  // Simulate initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setLoadingState(true);
      setLoadingText("Loading products...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoadingState(true);
      setLoadedText("Products loaded successfully");
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    loadInitialData();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      filterStatus === "All" ? true : product.status === filterStatus
    )
    .filter((product) =>
      filterCategory === "All" ? true : product.category === filterCategory
    )
    .sort((a, b) => {
      if (
        sortField === "stock" ||
        sortField === "price" ||
        sortField === "threshold" ||
        sortField === "buyingPrice"
      ) {
        return sortDirection === "asc"
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else {
        return sortDirection === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter(
    (p) => p.status === "Out of Stock"
  ).length;

  const handleEdit = async (product) => {
    setModalLoading(true);
    setModalLoadingText("Loading product details...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentProduct({ ...product });
    setShowEditModal(true);
    setModalLoading(false);
  };

  const handleRestock = async (product) => {
    setModalLoading(true);
    setModalLoadingText("Loading restock form...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentProduct({ ...product });
    setShowRestockModal(true);
    setModalLoading(false);
  };

  const saveEditedProduct = async (updatedProduct) => {
    setOperationLoading(true);
    setOperationLoadingText("Updating product...");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProducts(
      products.map((p) =>
        p.id === updatedProduct.id
          ? {
              ...updatedProduct,
              status:
                updatedProduct.stock >= updatedProduct.threshold
                  ? "In Stock"
                  : updatedProduct.stock > 0
                  ? "Low Stock"
                  : "Out of Stock",
            }
          : p
      )
    );
    setShowEditModal(false);
    setOperationLoading(false);
  };

  const saveRestockedProduct = async (updatedProduct) => {
    setOperationLoading(true);
    setOperationLoadingText("Restocking product...");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProducts(
      products.map((p) =>
        p.id === updatedProduct.id
          ? {
              ...updatedProduct,
              status:
                updatedProduct.stock >= updatedProduct.threshold
                  ? "In Stock"
                  : updatedProduct.stock > 0
                  ? "Low Stock"
                  : "Out of Stock",
            }
          : p
      )
    );
    setShowRestockModal(false);
    setOperationLoading(false);
  };

  const handleDeleteProductClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      setOperationLoading(true);
      setOperationLoadingText("Deleting product...");
      
      console.log(`Deleting product with ID: ${productToDelete.id}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setIsDeleting(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
      setOperationLoading(false);
      
      console.log(`Product "${productToDelete.name}" deleted successfully.`);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setIsDeleting(false);
    console.log("Delete operation cancelled.");
  };

  const handleProductChangeInEditModal = (updatedProduct) => {
    setCurrentProduct(updatedProduct);
  };

  const handleAddProductClick = async () => {
    setModalLoading(true);
    setModalLoadingText("Loading add product form...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowAddProductModal(true);
    setModalLoading(false);
  };

  const handleSaveNewProduct = async (newProductData) => {
    setOperationLoading(true);
    setOperationLoadingText("Adding new product...");
    
    console.log("Attempting to add new product:", newProductData);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const productWithId = {
      ...newProductData,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    };

    setProducts((prevProducts) => [...prevProducts, productWithId]);
    setShowAddProductModal(false);
    setOperationLoading(false);
    
    console.log(`Product "${productWithId.name}" added successfully!`);
  };

  // Check if any modal is open
  const isAnyModalOpen = showEditModal || showRestockModal || showDeleteModal || showAddProductModal;

  // Show content loader during operations
  if (operationLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={operationLoadingText}
                loadedText=""
                color={primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show content loader during modal loading
  if (modalLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={true}
                loading={true}
                loadingText={modalLoadingText}
                loadedText=""
                color={primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show initial loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className='main-app-view'>
            <div className="main-app-content-container">
              <ContentLoader
                state={loadingState}
                loading={loading}
                loadingText={loadingText}
                loadedText={loadedText}
                color={primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If any modal is open, don't render the main content - only render modals
  if (isAnyModalOpen) {
    return (
      <>
        {/* Only render modals when they're open */}
        {showEditModal && (
          <EditProductModal
            show={showEditModal}
            product={currentProduct}
            onClose={() => setShowEditModal(false)}
            onSave={() => saveEditedProduct(currentProduct)}
            onProductChange={handleProductChangeInEditModal}
            categories={categories}
          />
        )}

        {showRestockModal && (
          <RestockProductModal
            show={showRestockModal}
            product={currentProduct}
            onClose={() => setShowRestockModal(false)}
            onSave={saveRestockedProduct}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            open={showDeleteModal}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Confirm Product Deletion"
            message={`Are you sure you want to permanently delete "${
              productToDelete?.name || "this product"
            }"? This action cannot be undone.`}
            confirmText="Delete Permanently"
            cancelText="No, Keep Product"
            isLoading={isDeleting}
            itemName={productToDelete ? productToDelete.name : ""}
          />
        )}

        {showAddProductModal && (
          <AddNewProductModal
            show={showAddProductModal}
            onClose={() => setShowAddProductModal(false)}
            onSave={handleSaveNewProduct}
            categories={categories}
          />
        )}
      </>
    );
  }

  // Render main content only when no modals are open
  return (
    <div className="min-h-screen bg-white p-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 p-2">
        Stock Management Page
      </h1>
      
      <div className="min-h-screen bg-white p-2">
        <StockSummaryCards
          totalProducts={products.length}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
        />

        <ProductControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
          onAddProduct={handleAddProductClick}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />

        <ProductsTable
          products={filteredProducts}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onEditProduct={handleEdit}
          onRestockProduct={handleRestock}
          onDeleteProduct={handleDeleteProductClick}
        />
      </div>
    </div>
  );
}
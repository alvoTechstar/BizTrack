// EditProductModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Box,
  styled,
  CircularProgress,
} from "@mui/material";
import TextInput from "../../../../../components/Input/TextInput";
import SelectInput from "../../../../../components/input/SelectInput";
import AppFormButton from "../../../../../components/buttons/AppFormButton";
import { useTheme } from "../../../../../components/theme/ThemeContext";
import Toaster from "../../../../../components/Toaster";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    maxWidth: "500px",
    width: "100%",
    margin: 0,
    height: "auto",
    maxHeight: "90vh",
    backgroundColor: "white",
  },
  "& .MuiDialog-container": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

const ModalOverlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1300,
});

export default function EditProductModal({
  show,
  product,
  onClose,
  onSave,
  onProductChange,
  categories,
}) {
  const { primaryColor } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [toaster, setToaster] = useState({
    open: false,
    state: null,
    title: "",
    message: "",
    position: "right",
  });

  if (!show || !product) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (
        !product.name ||
        !product.sku ||
        !product.unit ||
        product.buyingPrice <= 0 ||
        product.price <= 0
      ) {
        showToaster(
          "error",
          "Validation Error",
          "Please fill all required fields and ensure both prices are greater than 0."
        );
        setIsLoading(false);
        return;
      }
      if (product.buyingPrice > product.price) {
        showToaster(
          "error",
          "Validation Error",
          "Selling price must be greater than or equal to buying price."
        );
        setIsLoading(false);
        return;
      }

      await onSave(product);
      showToaster("success", "Success", "Product updated successfully");
      onClose();
    } catch (error) {
      showToaster("error", "Error", "Failed to update product");
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToaster = (state, title, message) => {
    setToaster({
      open: true,
      state: state,
      title,
      message,
      position: "right",
    });
  };

  const handleCloseToaster = () => {
    setToaster((prev) => ({ ...prev, open: false }));
  };

  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));

  return (
    <>
      <ModalOverlay>
        <Fade in={show} timeout={300}>
          <Box>
            <StyledDialog
              open={show}
              onClose={onClose}
              closeAfterTransition
              BackdropProps={{
                style: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }
              }}
            >
              {/* Dialog content with white background */}
              <Box sx={{ backgroundColor: "white" }}>
                <DialogTitle
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "20px 24px",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#353F50",
                  }}
                >
                  Edit Product
                </DialogTitle>

                <DialogContent sx={{ 
                  padding: "24px", 
                  paddingBottom: "0",
                  backgroundColor: "white" 
                }}>
                  <Box
                    sx={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "20px",
                      backgroundColor: "white"
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <TextInput
                        id="edit-product-name"
                        label="Product Name"
                        value={product.name}
                        handleInput={(e) =>
                          onProductChange({ ...product, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        required
                      />

                      <TextInput
                        id="edit-product-sku"
                        label="SKU"
                        value={product.sku}
                        handleInput={(e) =>
                          onProductChange({ ...product, sku: e.target.value })
                        }
                        placeholder="Enter SKU"
                        required
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <TextInput
                        id="edit-product-stock"
                        label="Current Stock"
                        type="number"
                        value={product.stock}
                        handleInput={(e) => {
                          const newStock = parseInt(e.target.value) || 0;
                          onProductChange({
                            ...product,
                            stock: newStock,
                            status:
                              newStock >= product.threshold
                                ? "In Stock"
                                : newStock > 0
                                  ? "Low Stock"
                                  : "Out of Stock",
                          });
                        }}
                        placeholder="0"
                        required
                      />

                      <TextInput
                        id="edit-product-unit"
                        label="Unit of Measure"
                        value={product.unit}
                        handleInput={(e) =>
                          onProductChange({ ...product, unit: e.target.value })
                        }
                        placeholder="e.g., kg, pcs"
                        required
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <TextInput
                        id="edit-product-buying-price"
                        label="Buying Price (KES)"
                        type="number"
                        step="0.01"
                        value={product.buyingPrice}
                        handleInput={(e) =>
                          onProductChange({
                            ...product,
                            buyingPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                        required
                      />

                      <TextInput
                        id="edit-product-selling-price"
                        label="Selling Price (KES)"
                        type="number"
                        step="0.01"
                        value={product.price}
                        handleInput={(e) =>
                          onProductChange({
                            ...product,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                        required
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <TextInput
                        id="edit-product-threshold"
                        label="Low Stock Threshold"
                        type="number"
                        value={product.threshold}
                        handleInput={(e) => {
                          const newThreshold = parseInt(e.target.value) || 0;
                          onProductChange({
                            ...product,
                            threshold: newThreshold,
                            status:
                              product.stock >= newThreshold
                                ? "In Stock"
                                : product.stock > 0
                                  ? "Low Stock"
                                  : "Out of Stock",
                          });
                        }}
                        placeholder="0"
                        required
                      />

                      <SelectInput
                        label="Category"
                        options={categoryOptions}
                        value={product.category}
                        onChange={(e) =>
                          onProductChange({ ...product, category: e.target.value })
                        }
                        required
                        fullWidth
                      />
                    </Box>
                  </Box>
                </DialogContent>

                <DialogActions
                  sx={{
                    paddingBottom: "35px",
                    gap: "12px",
                    margin: "0 30px 8px",
                    backgroundColor: "white",
                  }}
                >
                  <AppFormButton
                    text="Cancel"
                    color="invert"
                    action={onClose}
                    validation={true}
                    disabled={isLoading}
                  />

                  <AppFormButton
                    text={
                      isLoading ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                          <CircularProgress size={16} color="inherit" />
                          Saving...
                        </Box>
                      ) : (
                        "Save Changes"
                      )
                    }
                    color={primaryColor}
                    validation={true}
                    action={handleSave}
                    disabled={isLoading}
                  />
                </DialogActions>
              </Box>
            </StyledDialog>
          </Box>
        </Fade>
      </ModalOverlay>

      <Toaster
        open={toaster.open}
        state={toaster.state}
        title={toaster.title}
        message={toaster.message}
        position={toaster.position}
        action={handleCloseToaster}
      />
    </>
  );
}
// EditProductModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  Fade,
  Box,
  styled,
  CircularProgress,
} from "@mui/material";
import TextInput from "../../../../../components/input/TextInput";
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
  },
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(1px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

const AnimatedBackdrop = styled(Backdrop)({
  zIndex: -1,
  position: "fixed",
  backdropFilter: "blur(1px)",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
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
      <AnimatedBackdrop open={show} transitionDuration={300} />

      <StyledDialog
        open={show}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <Fade in={show} timeout={300}>
          <Box>
            <DialogTitle
              sx={{
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #e0e0e0",
                padding: "20px 24px",
                fontSize: "1.25rem",
                fontWeight: "600",
              }}
            >
              Edit Product
            </DialogTitle>

            <DialogContent sx={{ padding: "24px", paddingBottom: "0" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <TextInput
                    label="Product Name"
                    value={product.name}
                    onChange={(e) =>
                      onProductChange({ ...product, name: e.target.value })
                    }
                    placeholder="Enter product name"
                    required
                    fullWidth
                  />

                  <TextInput
                    label="SKU"
                    value={product.sku}
                    onChange={(e) =>
                      onProductChange({ ...product, sku: e.target.value })
                    }
                    placeholder="Enter SKU"
                    required
                    fullWidth
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
                    label="Current Stock"
                    type="number"
                    value={product.stock}
                    onChange={(e) => {
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
                    label="Unit of Measure"
                    value={product.unit}
                    onChange={(e) =>
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
                    label="Buying Price (KES)" // Updated label
                    type="number"
                    step="0.01"
                    value={product.buyingPrice}
                    onChange={(e) =>
                      onProductChange({
                        ...product,
                        buyingPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    required
                  />

                  <TextInput
                    label="Selling Price (KES)" // Updated label
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={(e) =>
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
                    label="Low Stock Threshold"
                    type="number"
                    value={product.threshold}
                    onChange={(e) => {
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
        </Fade>
      </StyledDialog>

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

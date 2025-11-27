import React, { useState, useEffect } from "react";
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

export default function AddNewProductModal({
  show,
  onClose,
  onSave,
  categories,
}) {
  const { primaryColor } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: categories.length > 0 ? categories[0] : "",
    stock: 0,
    unit: "",
    buyingPrice: 0.0,
    price: 0.0,
    threshold: 0,
  });
  const [toaster, setToaster] = useState({
    open: false,
    state: null,
    title: "",
    message: "",
    position: "right",
  });

  useEffect(() => {
    if (show) {
      setNewProduct({
        name: "",
        sku: "",
        category: categories.length > 0 ? categories[0] : "",
        stock: 0,
        unit: "",
        buyingPrice: 0.0,
        price: 0.0,
        threshold: 0,
      });
    }
  }, [show, categories]);

  const handleChange = (field, value) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (
        !newProduct.name ||
        !newProduct.sku ||
        !newProduct.unit ||
        newProduct.buyingPrice <= 0 ||
        newProduct.price <= 0
      ) {
        showToaster(
          "error",
          "Validation Error",
          "Please fill all required fields and ensure both prices are greater than 0."
        );
        setIsLoading(false);
        return;
      }
      if (newProduct.buyingPrice > newProduct.price) {
        showToaster(
          "error",
          "Validation Error",
          "Selling price must be greater than or equal to buying price."
        );
        setIsLoading(false);
        return;
      }

      const status =
        newProduct.stock >= newProduct.threshold
          ? "In Stock"
          : newProduct.stock > 0
          ? "Low Stock"
          : "Out of Stock";

      await onSave({
        ...newProduct,
        status: status,
      });

      showToaster("success", "Success", "Product added successfully");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showToaster("error", "Error", "Failed to add product");
      console.error("Error adding product:", error);
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
              Add New Product
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
                    id="product-name"
                    label="Product Name"
                    value={newProduct.name}
                    handleInput={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                  />

                  <TextInput
                    id="product-sku"
                    label="SKU"
                    value={newProduct.sku}
                    handleInput={(e) => handleChange("sku", e.target.value)}
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
                    id="product-stock"
                    label="Current Stock"
                    type="number"
                    value={newProduct.stock}
                    handleInput={(e) =>
                      handleChange("stock", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    required
                  />

                  <TextInput
                    id="product-unit"
                    label="Unit of Measure"
                    value={newProduct.unit}
                    handleInput={(e) => handleChange("unit", e.target.value)}
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
                    id="product-buying-price"
                    label="Buying Price (KES)"
                    type="number"
                    step="0.01"
                    value={newProduct.buyingPrice}
                    handleInput={(e) =>
                      handleChange(
                        "buyingPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    required
                  />

                  <TextInput
                    id="product-selling-price"
                    label="Selling Price (KES)"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    handleInput={(e) =>
                      handleChange("price", parseFloat(e.target.value) || 0)
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
                    id="product-threshold"
                    label="Low Stock Threshold"
                    type="number"
                    value={newProduct.threshold}
                    handleInput={(e) =>
                      handleChange("threshold", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    required
                  />

                  <SelectInput
                    label="Category"
                    options={categoryOptions}
                    value={newProduct.category}
                    onChange={(e) => handleChange("category", e.target.value)}
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
                      Adding...
                    </Box>
                  ) : (
                    "Add Product"
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
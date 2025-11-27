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
import AppFormButton from "../../../../../components/buttons/AppFormButton";
import Toaster from "../../../../../components/Toaster";
import { useTheme } from "../../../../../components/theme/ThemeContext";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    maxWidth: "500px",
    width: "100%",
  },
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(2px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

const AnimatedBackdrop = styled(Backdrop)({
  zIndex: -1,
  position: "fixed",
  backdropFilter: "blur(3px)",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
});

export default function RestockProductModal({
  show,
  product,
  onClose,
  onSave,
}) {
  const { primaryColor } = useTheme();
  const [addQuantity, setAddQuantity] = useState(0);
  const [displayProduct, setDisplayProduct] = useState(product);
  const [isLoading, setIsLoading] = useState(false);
  const [toaster, setToaster] = useState({
    open: false,
    state: null,
    title: "",
    message: "",
    position: "right",
  });

  // Update displayProduct when the 'product' prop changes
  useEffect(() => {
    setDisplayProduct(product);
    setAddQuantity(0); // Reset quantity when modal opens for a new product
  }, [product, show]);

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 0;
    setAddQuantity(qty);
    const newStock = product.stock + qty; // Calculate based on original product stock
    setDisplayProduct({
      ...product, // Use the original product details
      stock: newStock,
      status:
        newStock >= product.threshold
          ? "In Stock"
          : newStock > 0
            ? "Low Stock"
            : "Out of Stock",
    });
  };

  const showToaster = (state, title, message) => {
    setToaster({
      open: true,
      state: state, // "true" or "false" string
      title,
      message,
      position: "right",
    });
  };

  const handleCloseToaster = () => {
    setToaster((prev) => ({ ...prev, open: false }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(displayProduct);
      showToaster("true", "Success", "Product restocked successfully");
      onClose();
    } catch (error) {
      showToaster("false", "Error", "Failed to restock product");
      console.error("Error restocking product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show || !displayProduct) return null;

  return (
    <>
      <AnimatedBackdrop open={show} transitionDuration={500} />

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
              Restock Product
            </DialogTitle>

            <DialogContent sx={{ padding: "24px", paddingBottom: "0" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                <p className="mb-1">
                  <span className="text-xl font-bold text-gray-900">
                    {displayProduct.name}
                  </span>
                  <span className="text-gray-600 mx-2">-</span>
                  <span className="text-gray-700">Current stock:</span>
                  <span
                    className="font-semibold ml-1"
                    style={{ color: primaryColor }}
                  >
                    {product.stock}
                  </span>
                  <span className="text-gray-500 ml-1">{product.unit}</span>
                </p>

                <div className="mt-0 mb-0">
                  <TextInput
                    id="restockQuantity" // Add this id prop
                    label="Add Stock Quantity"
                    type="number"
                    value={addQuantity === 0 ? "" : addQuantity}
                    handleInput={(e) => handleQuantityChange(e)} // Use handleInput instead of onChange
                    placeholder="Enter quantity to add"
                    required={true}
                  />
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <p className="text-gray-700">
                      New Stock Level:{" "}
                      <span className="font-semibold">
                        {displayProduct.stock} {displayProduct.unit}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      New Status:{" "}
                      <span
                        className={
                          displayProduct.status === "In Stock"
                            ? "text-green-600"
                            : displayProduct.status === "Low Stock"
                              ? "text-amber-600"
                              : "text-red-600"
                        }
                      >
                        {displayProduct.status}
                      </span>
                    </p>
                  </Box>
                </div>              </Box>
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
                      Restocking...
                    </Box>
                  ) : (
                    "Confirm Restock"
                  )
                }
                color={primaryColor}
                validation={true}
                action={handleSave}
                disabled={isLoading || addQuantity <= 0}
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

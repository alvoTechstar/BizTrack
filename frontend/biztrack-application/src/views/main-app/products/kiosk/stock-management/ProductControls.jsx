import React from "react";
import { PlusCircle } from "lucide-react";
import SearchInput from "../../../../../components/input/SearchInput";
import SelectInput from "../../../../../components/input/SelectInput";
import AppFormButton from "../../../../../components/buttons/AppFormButton";
import { useTheme } from "../../../../../components/theme/ThemeContext";

export default function ProductControls({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  categories,
  onAddProduct,
}) {
  const { primaryColor } = useTheme();

  const statusOptions = [
    { value: "All", label: "All Status" },
    { value: "In Stock", label: "In Stock" },
    { value: "Low Stock", label: "Low Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
  ];

  const categoryOptions = [
    { value: "All", label: "All Categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Input - takes remaining space */}
        <div className="w-full md:flex-1 min-w-[200px]">
          <SearchInput
            id="product-search"
            placeholder="Search products by name or SKU..."
            input={searchTerm}
            handleInput={setSearchTerm}
            handleClear={() => setSearchTerm("")}
          />
        </div>

        {/* Controls Container - fixed width elements */}
        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          {/* Status Filter Select */}
          <div className="w-full md:w-[180px] h-[42px]">
            <SelectInput
              id="filter-status"
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-full"
            />
          </div>

          {/* Category Filter Select */}
          <div className="w-full md:w-[180px] h-[42px]">
            <SelectInput
              id="filter-category"
              options={categoryOptions}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-full"
            />
          </div>

          {/* Add Product Button */}
          <div className="w-full md:w-[150px] h-[42px]">
            <AppFormButton
              text="Add Product"
              color={primaryColor}
              isLoading={false}
              validation={true}
              action={onAddProduct}
              icon={<PlusCircle size={18} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
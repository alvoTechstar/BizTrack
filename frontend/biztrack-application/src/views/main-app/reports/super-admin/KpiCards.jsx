// src/views/main-app/reports/super-admin/components/KpiCards.jsx
import React from "react";

const KPICard = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 h-full flex flex-col justify-between">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export default KPICard;

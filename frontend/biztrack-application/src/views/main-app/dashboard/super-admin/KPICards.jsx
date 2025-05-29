import React from "react";
import { Grid } from "@mui/material";
import {
  Store as BusinessIcon,
  Receipt as TransactionIcon,
  AttachMoney as RevenueIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material";

const KPICards = ({ data }) => {
  const cards = [
    {
      title: "Total Businesses",
      value: data.totalBusinesses,
      icon: <BusinessIcon fontSize="large" className="text-blue-600" />,
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      hover: "hover:scale-105 hover:shadow-blue-300",
    },
    {
      title: "Total Transactions",
      value: data.totalTransactions.toLocaleString(),
      icon: <TransactionIcon fontSize="large" className="text-green-600" />,
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      hover: "hover:-translate-y-1 hover:shadow-green-300",
    },
    {
      title: "Total Revenue",
      value: `KSh ${data.totalRevenue.toLocaleString()}`,
      icon: <RevenueIcon fontSize="large" className="text-purple-600" />,
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      hover: "hover:rotate-1 hover:shadow-purple-300",
    },
    {
      title: "Pending Approvals",
      value: data.pendingApprovals,
      icon: <PendingIcon fontSize="large" className="text-orange-600" />,
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      hover: "hover:scale-95 hover:shadow-orange-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 shadow-sm transition-all transform cursor-pointer ${card.bgColor} ${card.hover}`}
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 ${card.iconBg}`}
          >
            {card.icon}
          </div>
          <p className="text-sm text-gray-600 font-medium">{card.title}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;

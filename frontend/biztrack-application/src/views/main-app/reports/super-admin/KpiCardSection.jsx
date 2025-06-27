import React, { useMemo } from "react";
import KPICard from "./KpiCards";

const formatKSh = (amount) => {
  return `KSh ${parseFloat(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const KPICardsSection = ({ transactions }) => {
  const {
    totalCommissionEarned,
    totalTransactions,
    avgCommissionPerTransaction,
    pendingCommissions,
  } = useMemo(() => {
    const completedTransactions = transactions.filter(
      (t) => t.status === "Completed"
    );
    const pendingDebtTransactions = transactions.filter(
      (t) => t.paymentMethod === "Debt" && t.status === "Pending"
    );

    const totalComm = completedTransactions.reduce(
      (sum, t) => sum + t.commission,
      0
    );
    const totalTxns = completedTransactions.length;
    const avgComm = totalTxns > 0 ? totalComm / totalTxns : 0;
    const pendingComm = pendingDebtTransactions.reduce(
      (sum, t) => sum + t.commission,
      0
    );

    return {
      totalCommissionEarned: formatKSh(totalComm),
      totalTransactions: totalTxns,
      avgCommissionPerTransaction: formatKSh(avgComm),
      pendingCommissions: formatKSh(pendingComm),
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <KPICard title="Total Commission Earned" value={totalCommissionEarned} />
      <KPICard title="Total Transactions" value={totalTransactions} />
      <KPICard
        title="Avg. Commission per Txn"
        value={avgCommissionPerTransaction}
      />
      <KPICard title="Pending Commissions" value={pendingCommissions} />
    </div>
  );
};

export default KPICardsSection;

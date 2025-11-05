import { useState } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaChartLine,
  FaCalendar,
} from "react-icons/fa";
import TransactionTable from "../components/TransactionTable";
import { Transaction } from "../types";

const dummyTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-11-02",
    category: "Tea + Nasta",
    description: "Morning tea and snacks for office staff",
    amount: 350,
    status: "Approved",
    remarks: "Monthly expense",
  },
  {
    id: "2",
    date: "2025-11-03",
    category: "Petrol",
    description: "Vehicle fuel for delivery",
    amount: 2000,
    status: "Pending",
    remarks: "",
  },
  {
    id: "3",
    date: "2025-11-03",
    category: "Stationary",
    description: "Office supplies and printer paper",
    amount: 850,
    status: "Approved",
    remarks: "Urgent purchase",
  },
];

export default function Dashboard() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(dummyTransactions);

  const openingBalance = 50000;
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const closingBalance = openingBalance - totalExpenses;
  const monthlyBudget = 75000;

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const totalTransactions = transactions.length;
  const approvedTransactions = transactions.filter(
    (t) => t.status === "Approved"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status === "Pending"
  ).length;
  const averageExpense =
    totalTransactions > 0 ? totalExpenses / totalTransactions : 0;

  const stats = [
    {
      title: "Opening Balance",
      value: openingBalance,
      icon: FaWallet,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: FaMoneyBillWave,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    },
    {
      title: "Closing Balance",
      value: closingBalance,
      icon: FaChartLine,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Monthly Budget",
      value: monthlyBudget,
      icon: FaCalendar,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: FaMoneyBillWave,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgLight: "bg-indigo-50",
    },
    {
      title: "Approved Transactions",
      value: approvedTransactions,
      icon: FaChartLine,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Pending Transactions",
      value: pendingTransactions,
      icon: FaWallet,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
    },
    {
      title: "Avg Expense",
      value: Math.round(averageExpense),
      icon: FaCalendar,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      bgLight: "bg-pink-50",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.bgLight} p-2 rounded-lg`}>
                  <Icon className={`${stat.textColor} text-xl`} />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-lg md:text-xl font-bold text-gray-800">
                {formatCurrency(stat.value)}
              </p>
            </div>
          );
        })}
      </div>

      <TransactionTable
        transactions={transactions}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}

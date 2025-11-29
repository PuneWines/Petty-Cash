

// import { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Pie, Line } from "react-chartjs-2";
// import {
//   FaFilePdf,
//   FaFileExcel,
//   FaChartPie,
//   FaChartLine,
//   FaCheck,
//   FaTimes,
// } from "react-icons/fa";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// interface ExpenseData {
//   date: string;
//   category: string;
//   amount: number;
//   type: "petty" | "tally";
//   description: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   type: "petty" | "tally";
// }

// export default function Reports() {
//   const [dateFrom, setDateFrom] = useState("2025-11-01");
//   const [dateTo, setDateTo] = useState("2025-11-04");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
//   const [cashType, setCashType] = useState<"petty" | "tally">("petty");
//   const [viewType, setViewType] = useState<"daily" | "weekly" | "monthly">("daily");
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
//   const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  

//   // ==== Added: Track localStorage total petty cash ====
//   const [localStoragePettyCashTotal, setLocalStoragePettyCashTotal] = useState<number | null>(null);
// const [loginUser, setLoginUser] = useState<{ name: string; role: string } | null>(null);




// const SHEET_URL = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";
//   const SHEET_ID = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I";


//  useEffect(() => {
//   // On mount, fetch the total petty cash amount from localStorage just like TransactionHistory page
//   try {
//     const data = JSON.parse(localStorage.getItem("pettyCashTransactions") || "[]");
//     const calculateTotal = (txn: any) =>
//       [
//         parseFloat(txn.openingQty) || 0,
//         parseFloat(txn.teaNasta) || 0,
//         parseFloat(txn.waterJar) || 0,
//         parseFloat(txn.lightBill) || 0,
//         parseFloat(txn.recharge) || 0,
//         parseFloat(txn.postOffice) || 0,
//         parseFloat(txn.customerDiscount) || 0,
//         parseFloat(txn.repairMaintenance) || 0,
//         parseFloat(txn.stationary) || 0,
//         parseFloat(txn.incentive) || 0,
//         parseFloat(txn.breakage) || 0,
//         parseFloat(txn.petrol) || 0,
//         parseFloat(txn.advance) || 0,
//         parseFloat(txn.excisePolice) || 0,
//         parseFloat(txn.desiBhada) || 0,
//         parseFloat(txn.otherVendorPayment) || 0,
//         parseFloat(txn.differenceAmount) || 0,
//         parseFloat(txn.patilPetrol) || 0,
//         parseFloat(txn.roomExpense) || 0,
//         parseFloat(txn.officeExpense) || 0,
//         parseFloat(txn.personalExpense) || 0,
//         parseFloat(txn.miscExpense) || 0,
//         parseFloat(txn.closing) || 0,
//         parseFloat(txn.creditCardCharges) || 0,
//       ].reduce((acc, val) => acc + val, 0);
//     const sum = data.reduce((sum: number, txn: any) => sum + calculateTotal(txn), 0);
//     setLocalStoragePettyCashTotal(sum);
//   } catch {
//     setLocalStoragePettyCashTotal(null);
//   }
// }, []);
// // ==== Added end ====
// useEffect(() => {
//   try {
//     const userData = JSON.parse(localStorage.getItem("loginUser") || "{}");
//     if (userData.name && userData.role) {
//       setLoginUser(userData);
//     }
//   } catch {
//     console.log("No login user found");
//   }
// }, []);

// // Column mapping for petty cash expenses - Add after SHEET_ID
// const columnMapping: { [key: string]: string } = {
//   "Tea + Nasta": "F",
//   "Petrol": "N",
//   "Stationary": "M",
//   "Light Bill": "H",
//   "Office Supplies": "X",
// };

// const fetchExpenseData = async () => {
//   setLoading(true);
//   try {
//     if (cashType === "petty") {
//       // Fetch Petty Cash from Google Sheet
//       const response = await fetch(
//         `${SHEET_URL}?action=getPettyExpenses&sheetId=${SHEET_ID}&dateFrom=${dateFrom}&dateTo=${dateTo}`
//       );
//       const data = await response.json();
//       console.log("Petty response:", data);
      
//       if (data.success && data.expenses && data.expenses.length > 0) {
//         let filteredExpenses = data.expenses;
        
//         // Filter by login user if not admin
//         if (loginUser && loginUser.role !== "admin") {
//           filteredExpenses = data.expenses.filter(
//             (row: any) => row.AB === loginUser.name || row.userName === loginUser.name
//           );
//         }

//         // Transform data
//         const expenses: ExpenseData[] = [];
//         filteredExpenses.forEach((row: any) => {
//           const date = row.date || new Date().toISOString().split('T')[0];
          
//           Object.entries(columnMapping).forEach(([categoryName, columnLetter]) => {
//             const amount = parseFloat(row[columnLetter]) || 0;
//             if (amount > 0) {
//               expenses.push({
//                 date,
//                 category: categoryName,
//                 amount,
//                 type: "petty",
//                 description: `${categoryName} expense`,
//               });
//             }
//           });
//         });
        
//         console.log("Transformed petty expenses:", expenses);
//         setExpenseData(expenses);
//       } else {
//         console.log("No petty data, using empty array");
//         setExpenseData([]);
//       }
//     } else {
//       // Fetch Tally Cash - Use different endpoint
//       const response = await fetch(
//         `${SHEET_URL}?action=getExpenses&sheetId=${SHEET_ID}&dateFrom=${dateFrom}&dateTo=${dateTo}`
//       );
//       const data = await response.json();
//       console.log("Tally response:", data);
      
//       if (data.success && data.expenses) {
//         setExpenseData(data.expenses);
//       } else {
//         setExpenseData([]);
//       }
//     }
//   } catch (err) {
//     console.error("Error fetching data:", err);
//     setExpenseData([]);
//   } finally {
//     setLoading(false);
//   }
// };

// // Update the useEffect that calls fetchExpenseData:
// useEffect(() => {
//   if (categories.length > 0) {
//     fetchExpenseData();
//   }
// }, [categories, dateFrom, dateTo, cashType, loginUser]);






  
//   // Fetch categories from Master sheet
//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${SHEET_URL}?action=getCategories&sheetId=${SHEET_ID}`);
//       const data = await response.json();
//       if (data.success && data.categories) {
//         setCategories(data.categories);
//       } else {
//         setCategories([
//           { id: "1", name: "Tea + Nasta", type: "petty" },
//           { id: "2", name: "Petrol", type: "petty" },
//           { id: "3", name: "Stationary", type: "petty" },
//           { id: "4", name: "Light Bill", type: "petty" },
//           { id: "5", name: "Office Supplies", type: "petty" },
//           { id: "6", name: "Salary", type: "tally" },
//           { id: "7", name: "Rent", type: "tally" },
//           { id: "8", name: "Equipment", type: "tally" },
//           { id: "9", name: "Marketing", type: "tally" },
//           { id: "10", name: "Miscellaneous", type: "tally" },
//         ]);
//       }
//     } catch (err) {
//       setCategories([
//         { id: "1", name: "Tea + Nasta", type: "petty" },
//         { id: "2", name: "Petrol", type: "petty" },
//         { id: "3", name: "Stationary", type: "petty" },
//         { id: "4", name: "Light Bill", type: "petty" },
//         { id: "5", name: "Office Supplies", type: "petty" },
//         { id: "6", name: "Salary", type: "tally" },
//         { id: "7", name: "Rent", type: "tally" },
//         { id: "8", name: "Equipment", type: "tally" },
//         { id: "9", name: "Marketing", type: "tally" },
//         { id: "10", name: "Miscellaneous", type: "tally" },
//       ]);
//     }
//   };



//   // Generate dummy data for fallback
//   const generateDummyData = (): ExpenseData[] => {
//     const pettyCategories = categories.filter(cat => cat.type === "petty");
//     const tallyCategories = categories.filter(cat => cat.type === "tally");
//     const data: ExpenseData[] = [];
//     const startDate = new Date(dateFrom);
//     const endDate = new Date(dateTo);

//     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//       const dateStr = d.toISOString().split('T')[0];
//       pettyCategories.forEach(category => {
//         data.push({
//           date: dateStr,
//           category: category.name,
//           amount: Math.floor(Math.random() * 2000) + 500,
//           type: "petty",
//           description: `${category.name} expense`
//         });
//       });
//       tallyCategories.forEach(category => {
//         data.push({
//           date: dateStr,
//           category: category.name,
//           amount: Math.floor(Math.random() * 10000) + 5000,
//           type: "tally",
//           description: `${category.name} expense`
//         });
//       });
//     }
//     return data;
//   };

//   // Category checkbox handler
//   const handleCategoryCheckboxChange = (categoryName: string) => {
//     if (categoryName === "all") {
//       if (selectedCategories.includes("all")) {
//         setSelectedCategories([]);
//       } else {
//         const allCategories = categories
//           .filter(cat => cat.type === cashType)
//           .map(cat => cat.name);
//         setSelectedCategories(["all", ...allCategories]);
//       }
//     } else {
//       if (selectedCategories.includes(categoryName)) {
//         const newSelected = selectedCategories.filter(cat => cat !== categoryName && cat !== "all");
//         setSelectedCategories(newSelected.length > 0 ? newSelected : ["all"]);
//       } else {
//         const newSelected = [...selectedCategories.filter(cat => cat !== "all"), categoryName];
//         setSelectedCategories(newSelected);
//       }
//     }
//   };

//   const handleSelectAll = () => {
//     const allCategories = categories
//       .filter(cat => cat.type === cashType)
//       .map(cat => cat.name);
//     setSelectedCategories(["all", ...allCategories]);
//   };

//   const handleClearAll = () => {
//     setSelectedCategories(["all"]);
//   };

//   const isAllSelected = () => {
//     const currentTypeCategories = categories
//       .filter(cat => cat.type === cashType)
//       .map(cat => cat.name);
//     return currentTypeCategories.every(cat => selectedCategories.includes(cat));
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (categories.length > 0) {
//       fetchExpenseData();
//     }
//   }, [categories, dateFrom, dateTo]);

//   useEffect(() => {
//     setSelectedCategories(["all"]);
//   }, [cashType]);

//   const filteredData = expenseData.filter(expense => {
//     const matchesType = expense.type === cashType;
//     const matchesDate = expense.date >= dateFrom && expense.date <= dateTo;
//     const matchesCategory = selectedCategories.includes("all") ||
//       selectedCategories.includes(expense.category);
//     return matchesType && matchesCategory && matchesDate;
//   });

//   const getWeekNumber = (dateString: string): string => {
//     const date = new Date(dateString);
//     const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
//     const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
//     return `Week ${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
//   };

//   const getMonthFromDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleString('default', { month: 'long', year: 'numeric' });
//   };

//  // Replace getPieChartData function with this:
// const getPieChartData = () => {
  
//   const categoryTotals: { [key: string]: number } = {};
  
//   filteredData.forEach(expense => {
//     if (categoryTotals[expense.category]) {
//       categoryTotals[expense.category] += expense.amount;
//     } else {
//       categoryTotals[expense.category] = expense.amount;
//     }
//   });
  
//   console.log("categoryTotals:", categoryTotals); // Debug
  
//   const labels = Object.keys(categoryTotals);
//   const values = Object.values(categoryTotals);
  
//   return {
//     labels,
//     datasets: [
//       {
//         label: "Expenses by Category",
//         data: values,
//         backgroundColor: [
//           "rgba(42, 82, 152, 0.8)",
//           "rgba(239, 68, 68, 0.8)",
//           "rgba(59, 130, 246, 0.8)",
//           "rgba(251, 191, 36, 0.8)",
//           "rgba(16, 185, 129, 0.8)",
//           "rgba(147, 51, 234, 0.8)",
//           "rgba(236, 72, 153, 0.8)",
//         ],
//         borderColor: [
//           "rgba(42, 82, 152, 1)",
//           "rgba(239, 68, 68, 1)",
//           "rgba(59, 130, 246, 1)",
//           "rgba(251, 191, 36, 1)",
//           "rgba(16, 185, 129, 1)",
//           "rgba(147, 51, 234, 1)",
//           "rgba(236, 72, 153, 1)",
//         ],
//         borderWidth: 2,
//       },
//     ],
//   };
// };

//   const getLineChartData = () => {
//     let groupedData: { [key: string]: number } = {};
//     if (viewType === "daily") {
//       filteredData.forEach(expense => {
//         if (groupedData[expense.date]) {
//           groupedData[expense.date] += expense.amount;
//         } else {
//           groupedData[expense.date] = expense.amount;
//         }
//       });
//     } else if (viewType === "weekly") {
//       filteredData.forEach(expense => {
//         const week = getWeekNumber(expense.date);
//         if (groupedData[week]) {
//           groupedData[week] += expense.amount;
//         } else {
//           groupedData[week] = expense.amount;
//         }
//       });
//     } else if (viewType === "monthly") {
//       filteredData.forEach(expense => {
//         const month = getMonthFromDate(expense.date);
//         if (groupedData[month]) {
//           groupedData[month] += expense.amount;
//         } else {
//           groupedData[month] = expense.amount;
//         }
//       });
//     }
//     const labels = Object.keys(groupedData).sort();
//     const values = labels.map(key => groupedData[key]);
//     return {
//       labels,
//       datasets: [
//         {
//           label: `Expenses (${viewType})`,
//           data: values,
//           borderColor: "rgba(42, 82, 152, 1)",
//           backgroundColor: "rgba(42, 82, 152, 0.1)",
//           tension: 0.4,
//           fill: true,
//           pointRadius: 6,
//           pointHoverRadius: 8,
//           pointBackgroundColor: "rgba(42, 82, 152, 1)",
//           pointBorderColor: "#fff",
//           pointBorderWidth: 2,
//         },
//       ],
//     };
//   };

//   // Always return sum for summary, but
//   // in rendering, show localStoragePettyCashTotal when cashType is petty
//   const getSummaryData = () => {
//     let total = 0;
//     let highest = 0;
//     if (viewType === "daily") {
//       const dailyTotals: { [key: string]: number } = {};
//       filteredData.forEach(expense => {
//         dailyTotals[expense.date] = (dailyTotals[expense.date] || 0) + expense.amount;
//       });
//       total = Object.values(dailyTotals).reduce((sum, amount) => sum + amount, 0);
//       highest = Math.max(...Object.values(dailyTotals), 0);
//     } else if (viewType === "weekly") {
//       const weeklyTotals: { [key: string]: number } = {};
//       filteredData.forEach(expense => {
//         const week = getWeekNumber(expense.date);
//         weeklyTotals[week] = (weeklyTotals[week] || 0) + expense.amount;
//       });
//       total = Object.values(weeklyTotals).reduce((sum, amount) => sum + amount, 0);
//       highest = Math.max(...Object.values(weeklyTotals), 0);
//     } else if (viewType === "monthly") {
//       const monthlyTotals: { [key: string]: number } = {};
//       filteredData.forEach(expense => {
//         const month = getMonthFromDate(expense.date);
//         monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
//       });
//       total = Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
//       highest = Math.max(...Object.values(monthlyTotals), 0);
//     }
//     const periods = Object.keys(getLineChartData().labels).length;
//     const avgPeriod = periods > 0 ? total / periods : 0;
//     const categoryCount = new Set(filteredData.map(expense => expense.category)).size;
//     return {
//       total,
//       avgPeriod,
//       highest,
//       categories: categoryCount,
//       periods,
//     };
//   };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom" as const,
//         labels: {
//           padding: 20,
//           font: {
//             size: 12,
//             family: "'Segoe UI', sans-serif",
//           },
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context: any) {
//             const label = context.label || "";
//             const value = context.parsed || 0;
//             return `${label}: ₹${value.toLocaleString("en-IN")}`;
//           },
//         },
//       },
//     },
//   };

//   const lineOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context: any) {
//             return `Expenses: ₹${context.parsed.y.toLocaleString("en-IN")}`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: function (value: any) {
//             return "₹" + value.toLocaleString("en-IN");
//           },
//         },
//       },
//     },
//   };

//   const handleExportPDF = () => {
//     alert(`Exporting ${cashType} cash report as PDF...`);
//   };

//   const handleExportExcel = () => {
//     alert(`Exporting ${cashType} cash report as Excel...`);
//   };

//   const pieChartData = getPieChartData();
//   const lineChartData = getLineChartData();
//   const summaryData = getSummaryData();
//   const currentTypeCategories = categories.filter(cat => cat.type === cashType);

// // ==== Added: Track total tally cash from fetched data ====
// const totalTallyCash = expenseData
//   .filter(expense => expense.type === "tally")
//   .reduce((sum, expense) => sum + expense.amount, 0);
// // ==== Added end ====


// const totalToShow =
//   cashType === "petty"
//     ? (localStoragePettyCashTotal !== null && localStoragePettyCashTotal > 0 ? localStoragePettyCashTotal : summaryData.total)
//     : cashType === "tally"
//     ? totalTallyCash
//     : summaryData.total;

// // ==== Modified end ====
// console.log("expenseData length:", expenseData.length);
// console.log("localStoragePettyCashTotal:", localStoragePettyCashTotal);
// console.log("totalTallyCash:", totalTallyCash);
// console.log("totalToShow:", totalToShow);
// console.log("cashType:", cashType);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg font-semibold text-gray-600">Loading data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Options</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Cash Type
//             </label>
//             <select
//               value={cashType}
//               onChange={(e) => setCashType(e.target.value as "petty" | "tally")}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-semibold"
//             >
//               <option value="petty">Petty Cash</option>
//               <option value="tally">Tally Cash</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             />
//           </div>
//           <div className="relative">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Category {selectedCategories.length > 1 && `(${selectedCategories.filter(cat => cat !== "all").length} selected)`}
//             </label>
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent text-left bg-white flex justify-between items-center"
//               >
//                 <span>
//                   {selectedCategories.includes("all") || selectedCategories.length === 0
//                     ? "All Categories"
//                     : `${selectedCategories.length} categories selected`}
//                 </span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               {showCategoryDropdown && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   <div className="p-3 border-b border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm font-semibold">Select Categories</span>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={handleSelectAll}
//                           className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
//                         >
//                           <FaCheck className="inline w-3 h-3 mr-1" />
//                           All
//                         </button>
//                         <button
//                           onClick={handleClearAll}
//                           className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
//                         >
//                           <FaTimes className="inline w-3 h-3 mr-1" />
//                           Clear
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-2 space-y-1">
//                     <label className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={selectedCategories.includes("all") || isAllSelected()}
//                         onChange={() => handleCategoryCheckboxChange("all")}
//                         className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm font-medium">All Categories</span>
//                     </label>
//                     {currentTypeCategories.map(category => (
//                       <label key={category.id} className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={selectedCategories.includes(category.name) || selectedCategories.includes("all")}
//                           onChange={() => handleCategoryCheckboxChange(category.name)}
//                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                         />
//                         <span className="ml-2 text-sm">{category.name}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               View Type
//             </label>
//             <select
//               value={viewType}
//               onChange={(e) => setViewType(e.target.value as "daily" | "weekly" | "monthly")}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//             </select>
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-blue-100 p-2 rounded-lg">
//               <FaChartPie className="text-[#2a5298] text-xl" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">
//                 Expense by Category
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {cashType === "petty" ? "Petty Cash" : "Tally Cash"} Distribution
//               </p>
//             </div>
//           </div>
//           <div className="h-[300px] md:h-[350px]">
//             {pieChartData.labels.length > 0 ? (
//               <Pie data={pieChartData} options={pieOptions} />
//             ) : (
//               <div className="flex justify-center items-center h-full text-gray-500">
//                 No data available for selected filters
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-green-100 p-2 rounded-lg">
//               <FaChartLine className="text-green-600 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">
//                 Expense Trend ({viewType})
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {cashType === "petty" ? "Petty Cash" : "Tally Cash"} over time
//               </p>
//             </div>
//           </div>
//           <div className="h-[300px] md:h-[350px]">
//             {lineChartData.labels.length > 0 ? (
//               <Line data={lineChartData} options={lineOptions} />
//             ) : (
//               <div className="flex justify-center items-center h-full text-gray-500">
//                 No data available for selected filters
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Export Reports</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Download your {cashType === "petty" ? "Petty Cash" : "Tally Cash"} reports
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={handleExportPDF}
//               className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
//             >
//               <FaFilePdf />
//               Export PDF
//             </button>
//             <button
//               onClick={handleExportExcel}
//               className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
//             >
//               <FaFileExcel />
//               Export Excel
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* ---- Only changed logic below in Total Expenses card ---- */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           Summary Statistics - {cashType === "petty" ? "Petty Cash" : "Tally Cash"} ({viewType})
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//   <p className="text-sm text-gray-600 mb-1">Total Expenses</p>

// <p className="text-2xl font-bold text-blue-700">
//   ₹{totalToShow.toLocaleString("en-IN")}
// </p>


// </div>
//           <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//             <p className="text-sm text-gray-600 mb-1">
//               Avg. {viewType === 'daily' ? 'Daily' : viewType === 'weekly' ? 'Weekly' : 'Monthly'}
//             </p>
//             <p className="text-2xl font-bold text-green-700">
//               ₹{summaryData.avgPeriod.toLocaleString("en-IN")}
//             </p>
//           </div>
//           <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//             <p className="text-sm text-gray-600 mb-1">
//               Highest {viewType === 'daily' ? 'Day' : viewType === 'weekly' ? 'Week' : 'Month'}
//             </p>
//             <p className="text-2xl font-bold text-yellow-700">
//               ₹{summaryData.highest.toLocaleString("en-IN")}
//             </p>
//           </div>
//           <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
//             <p className="text-sm text-gray-600 mb-1">Categories</p>
//             <p className="text-2xl font-bold text-purple-700">
//               {summaryData.categories}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  FaFilePdf,
  FaFileExcel,
  FaChartPie,
  FaChartLine,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseData {
  date: string;
  category: string;
  amount: number;
  type: "petty" | "tally";
  description: string;
  sheetName?: string;
}

interface Category {
  id: string;
  name: string;
  type: "petty" | "tally";
}

export default function Reports() {
  // ==== Date range - last 7 days ====
  const getToday = () => new Date().toISOString().split('T')[0];
  const getSevenDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };
  
  const [dateFrom, setDateFrom] = useState(getSevenDaysAgo());
  const [dateTo, setDateTo] = useState(getToday());
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [cashType, setCashType] = useState<"petty" | "tally">("petty");
  const [viewType, setViewType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState<{ name: string; role: string } | null>(null);
  const [selectedTallySheet, setSelectedTallySheet] = useState<string>("All");
  
  const tallySheets = [
    "All",
    "Cash Tally Counter 1", 
    "Cash Tally Counter 2",
    "Cash Tally Counter 3",
  ];

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";
  const SHEET_ID = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I";

  // Debounce utility
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // LocalStorage petty cash total - ORIGINAL LOGIC RESTORED
  const [localStoragePettyCashTotal, setLocalStoragePettyCashTotal] = useState<number | null>(null);
  
  useEffect(() => {
    // On mount, fetch the total petty cash amount from localStorage just like TransactionHistory page
    try {
      const data = JSON.parse(localStorage.getItem("pettyCashTransactions") || "[]");
      const calculateTotal = (txn: any) =>
        [
          parseFloat(txn.openingQty) || 0,
          parseFloat(txn.teaNasta) || 0,
          parseFloat(txn.waterJar) || 0,
          parseFloat(txn.lightBill) || 0,
          parseFloat(txn.recharge) || 0,
          parseFloat(txn.postOffice) || 0,
          parseFloat(txn.customerDiscount) || 0,
          parseFloat(txn.repairMaintenance) || 0,
          parseFloat(txn.stationary) || 0,
          parseFloat(txn.incentive) || 0,
          parseFloat(txn.breakage) || 0,
          parseFloat(txn.petrol) || 0,
          parseFloat(txn.advance) || 0,
          parseFloat(txn.excisePolice) || 0,
          parseFloat(txn.desiBhada) || 0,
          parseFloat(txn.otherVendorPayment) || 0,
          parseFloat(txn.differenceAmount) || 0,
          parseFloat(txn.patilPetrol) || 0,
          parseFloat(txn.roomExpense) || 0,
          parseFloat(txn.officeExpense) || 0,
          parseFloat(txn.personalExpense) || 0,
          parseFloat(txn.miscExpense) || 0,
          parseFloat(txn.closing) || 0,
          parseFloat(txn.creditCardCharges) || 0,
        ].reduce((acc, val) => acc + val, 0);
      const sum = data.reduce((sum: number, txn: any) => sum + calculateTotal(txn), 0);
      setLocalStoragePettyCashTotal(sum);
    } catch {
      setLocalStoragePettyCashTotal(null);
    }
  }, []);

  // Get user from localStorage
  useEffect(() => {
    const userName = localStorage.getItem('currentUserName');
    const userRole = localStorage.getItem('currentUserRole');
    if (userName && userRole) {
      setLoginUser({ name: userName, role: userRole });
    }
  }, []);

  // Column mapping
  const columnMapping: { [key: string]: string } = {
    "Tea + Nasta": "F",
    "Petrol": "N",
    "Stationary": "M",
    "Light Bill": "H",
    "Office Supplies": "X",
  };

  // Fetch expense data
  const fetchExpenseData = useCallback(async () => {
    if (!loginUser) return;
    setLoading(true);
    
    try {
      if (cashType === "petty") {
        const response = await fetch(
          `${SHEET_URL}?action=getPettyExpenses&sheetId=${SHEET_ID}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );
        const data = await response.json();
        
        if (data.success && data.expenses) {
          let filteredExpenses = data.expenses;
          if (loginUser.role.toLowerCase() !== 'admin') {
            filteredExpenses = data.expenses.filter(
              (row: any) => row.AB && row.AB.toString().trim().toLowerCase() === loginUser.name.toLowerCase()
            );
          }

          const expenses: ExpenseData[] = [];
          filteredExpenses.forEach((row: any) => {
            const date = row.date || new Date().toISOString().split('T')[0];
            if (date < dateFrom || date > dateTo) return;
            
            Object.entries(columnMapping).forEach(([categoryName, columnLetter]) => {
              const amount = parseFloat(row[columnLetter]) || 0;
              if (amount > 0) {
                expenses.push({
                  date,
                  category: categoryName,
                  amount,
                  type: "petty",
                  description: `${categoryName} expense`,
                });
              }
            });
          });
          setExpenseData(expenses);
        } else {
          setExpenseData([]);
        }
      } else {
        const sheetsToFetch = selectedTallySheet === "All" 
          ? tallySheets.filter(sheet => sheet !== "All") 
          : [selectedTallySheet];

        const allExpenses: ExpenseData[] = [];
        for (const sheet of sheetsToFetch) {
          const response = await fetch(
            `${SHEET_URL}?action=getTallyExpenses&sheetId=${SHEET_ID}&sheetName=${encodeURIComponent(sheet)}&dateFrom=${dateFrom}&dateTo=${dateTo}`
          );
          const data = await response.json();
          
          if (data.success && data.expenses) {
            let filteredExpenses = data.expenses;
            if (loginUser.role.toLowerCase() !== 'admin') {
              filteredExpenses = data.expenses.filter(
                (row: any) => row.D && row.D.toString().trim().toLowerCase() === loginUser.name.toLowerCase()
              );
            }

            filteredExpenses.forEach((row: any) => {
              const date = row.date || new Date().toISOString().split('T')[0];
              if (date < dateFrom || date > dateTo) return;
              
              const scanAmount = parseFloat(row.E) || 0;
              if (scanAmount > 0) {
                allExpenses.push({
                  date,
                  category: "Scan Amount",
                  amount: scanAmount,
                  type: "tally",
                  description: `Scan Amount - ${sheet}`,
                  sheetName: sheet,
                });
              }
              
              const cashBilling = parseFloat(row.O) || 0;
              if (cashBilling > 0) {
                allExpenses.push({
                  date,
                  category: "Cash Billing",
                  amount: cashBilling,
                  type: "tally",
                  description: `Cash Billing - ${sheet}`,
                  sheetName: sheet,
                });
              }
              
              const generalExpense = parseFloat(row.Z) || 0;
              if (generalExpense > 0) {
                allExpenses.push({
                  date,
                  category: "General Expense",
                  amount: generalExpense,
                  type: "tally",
                  description: `General Expense - ${sheet}`,
                  sheetName: sheet,
                });
              }
            });
          }
        }
        setExpenseData(allExpenses);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  }, [cashType, dateFrom, dateTo, loginUser, selectedTallySheet]);

  const debouncedFetchExpenseData = useMemo(
    () => debounce(fetchExpenseData, 500),
    [fetchExpenseData]
  );

  useEffect(() => {
    debouncedFetchExpenseData();
  }, [debouncedFetchExpenseData]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${SHEET_URL}?action=getCategories&sheetId=${SHEET_ID}`);
        const data = await response.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        } else {
          setCategories([
            { id: "1", name: "Tea + Nasta", type: "petty" },
            { id: "2", name: "Petrol", type: "petty" },
            { id: "3", name: "Stationary", type: "petty" },
            { id: "4", name: "Light Bill", type: "petty" },
            { id: "5", name: "Office Supplies", type: "petty" },
            { id: "6", name: "Scan Amount", type: "tally" },
            { id: "7", name: "Cash Billing", type: "tally" },
            { id: "8", name: "General Expense", type: "tally" },
          ]);
        }
      } catch {
        setCategories([
          { id: "1", name: "Tea + Nasta", type: "petty" },
          { id: "2", name: "Petrol", type: "petty" },
          { id: "3", name: "Stationary", type: "petty" },
          { id: "4", name: "Light Bill", type: "petty" },
          { id: "5", name: "Office Supplies", type: "petty" },
          { id: "6", name: "Scan Amount", type: "tally" },
          { id: "7", name: "Cash Billing", type: "tally" },
          { id: "8", name: "General Expense", type: "tally" },
        ]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategories(["all"]);
  }, [cashType]);

  // Category handlers
  const handleCategoryCheckboxChange = (categoryName: string) => {
    if (categoryName === "all") {
      if (selectedCategories.includes("all")) {
        setSelectedCategories([]);
      } else {
        const allCategories = categories
          .filter(cat => cat.type === cashType)
          .map(cat => cat.name);
        setSelectedCategories(["all", ...allCategories]);
      }
    } else {
      let newSelected: string[];
      if (selectedCategories.includes(categoryName)) {
        newSelected = selectedCategories.filter(cat => cat !== categoryName && cat !== "all");
      } else {
        newSelected = selectedCategories
          .filter(cat => cat !== "all")
          .concat(categoryName);
      }
      setSelectedCategories(newSelected);
    }
  };

  const handleSelectAll = () => {
    const allCategories = categories
      .filter(cat => cat.type === cashType)
      .map(cat => cat.name);
    setSelectedCategories(["all", ...allCategories]);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const isAllSelected = () => {
    const currentTypeCategories = categories
      .filter(cat => cat.type === cashType)
      .map(cat => cat.name);
    return currentTypeCategories.every(cat => selectedCategories.includes(cat));
  };

  const filteredData = expenseData.filter(expense => {
    const matchesType = expense.type === cashType;
    const matchesDate = expense.date >= dateFrom && expense.date <= dateTo;
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes("all") ||
      selectedCategories.includes(expense.category);
    return matchesType && matchesDate && matchesCategory;
  });

  // Chart data functions
  const getWeekNumber = (dateString: string): string => {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return `Week ${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
  };

  const getMonthFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getCategoryColors = () => ({
    "Tea + Nasta": { bg: "rgba(239, 68, 68, 0.8)", border: "rgba(239, 68, 68, 1)" },
    "Petrol": { bg: "rgba(59, 130, 246, 0.8)", border: "rgba(59, 130, 246, 1)" },
    "Stationary": { bg: "rgba(251, 191, 36, 0.8)", border: "rgba(251, 191, 36, 1)" },
    "Light Bill": { bg: "rgba(16, 185, 129, 0.8)", border: "rgba(16, 185, 129, 1)" },
    "Office Supplies": { bg: "rgba(147, 51, 234, 0.8)", border: "rgba(147, 51, 234, 1)" },
    "Scan Amount": { bg: "rgba(42, 82, 152, 0.8)", border: "rgba(42, 82, 152, 1)" },
    "Cash Billing": { bg: "rgba(236, 72, 153, 0.8)", border: "rgba(236, 72, 153, 1)" },
    "General Expense": { bg: "rgba(34, 197, 94, 0.8)", border: "rgba(34, 197, 94, 1)" },
  });

  const getPieChartData = () => {
    const categoryTotals: { [key: string]: number } = {};
    filteredData.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const labels = Object.keys(categoryTotals);
    const categoryColors = getCategoryColors();
    const backgroundColors = labels.map(category => 
      categoryColors[category as keyof typeof categoryColors]?.bg || "rgba(128, 128, 128, 0.8)"
    );
    const borderColors = labels.map(category => 
      categoryColors[category as keyof typeof categoryColors]?.border || "rgba(128, 128, 128, 1)"
    );
    
    return {
      labels,
      datasets: [{
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      }],
    };
  };

  const getLineChartData = () => {
    let groupedData: { [key: string]: number } = {};
    if (viewType === "daily") {
      filteredData.forEach(expense => {
        groupedData[expense.date] = (groupedData[expense.date] || 0) + expense.amount;
      });
    } else if (viewType === "weekly") {
      filteredData.forEach(expense => {
        const week = getWeekNumber(expense.date);
        groupedData[week] = (groupedData[week] || 0) + expense.amount;
      });
    } else {
      filteredData.forEach(expense => {
        const month = getMonthFromDate(expense.date);
        groupedData[month] = (groupedData[month] || 0) + expense.amount;
      });
    }
    const labels = Object.keys(groupedData).sort();
    const values = labels.map(key => groupedData[key]);
    return {
      labels,
      datasets: [{
        label: `Expenses (${viewType})`,
        data: values,
        borderColor: "rgba(42, 82, 152, 1)",
        backgroundColor: "rgba(42, 82, 152, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(42, 82, 152, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }],
    };
  };

  // ORIGINAL SUMMARY LOGIC RESTORED
  const getSummaryData = () => {
    let total = 0;
    let highest = 0;
    if (viewType === "daily") {
      const dailyTotals: { [key: string]: number } = {};
      filteredData.forEach(expense => {
        dailyTotals[expense.date] = (dailyTotals[expense.date] || 0) + expense.amount;
      });
      total = Object.values(dailyTotals).reduce((sum, amount) => sum + amount, 0);
      highest = Math.max(...Object.values(dailyTotals), 0);
    } else if (viewType === "weekly") {
      const weeklyTotals: { [key: string]: number } = {};
      filteredData.forEach(expense => {
        const week = getWeekNumber(expense.date);
        weeklyTotals[week] = (weeklyTotals[week] || 0) + expense.amount;
      });
      total = Object.values(weeklyTotals).reduce((sum, amount) => sum + amount, 0);
      highest = Math.max(...Object.values(weeklyTotals), 0);
    } else {
      const monthlyTotals: { [key: string]: number } = {};
      filteredData.forEach(expense => {
        const month = getMonthFromDate(expense.date);
        monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
      });
      total = Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
      highest = Math.max(...Object.values(monthlyTotals), 0);
    }
    const periods = getLineChartData().labels.length;
    const avgPeriod = periods > 0 ? total / periods : 0;
    const categoryCount = new Set(filteredData.map(expense => expense.category)).size;
    return { total, avgPeriod, highest, categories: categoryCount, periods };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 20, font: { size: 12, family: "'Segoe UI', sans-serif" } },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Expenses: ₹${context.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => "₹" + value.toLocaleString("en-IN"),
        },
      },
    },
  };

  // PDF Export - Browser Print to PDF
  const handleExportPDF = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2a5298; text-align: center;">${cashType.toUpperCase()} CASH REPORT</h1>
        <p><strong>Date Range:</strong> ${dateFrom} to ${dateTo}</p>
        <p><strong>Cash Type:</strong> ${cashType === "petty" ? "Petty Cash" : "Tally Cash"}</p>
        ${cashType === "tally" && selectedTallySheet !== "All" ? `<p><strong>Sheet:</strong> ${selectedTallySheet}</p>` : ''}
        
        <h2>Expenses Data</h2>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #2a5298; color: white;">
              <th style="padding: 10px;">Date</th>
              <th style="padding: 10px;">Category</th>
              <th style="padding: 10px;">Amount</th>
              <th style="padding: 10px;">Description</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(expense => `
              <tr>
                <td style="padding: 8px;">${expense.date}</td>
                <td style="padding: 8px;">${expense.category}</td>
                <td style="padding: 8px;">₹${expense.amount.toLocaleString("en-IN")}</td>
                <td style="padding: 8px;">${expense.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2 style="margin-top: 30px;">Summary</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
          <div><strong>Total:</strong> ₹${getSummaryData().total.toLocaleString("en-IN")}</div>
          <div><strong>Average:</strong> ₹${getSummaryData().avgPeriod.toLocaleString("en-IN")}</div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${cashType} Report</title>
        <style>
          @media print {
            body { margin: 0; font-size: 12px; }
            table { font-size: 10px; }
          }
        </style>
      </head>
      <body onload="window.print();window.close()">${printContent}</body>
      </html>
    `);
    printWindow?.document.close();
  };

  // Excel Export - CSV Download
  const handleExportExcel = () => {
    const csvContent = [
      ['Date', 'Category', 'Amount', 'Description', 'Cash Type', 'Sheet'],
      ...filteredData.map(expense => [
        expense.date,
        expense.category,
        expense.amount,
        expense.description,
        expense.type,
        expense.sheetName || ''
      ])
    ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${cashType}_report_${dateFrom}_to_${dateTo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pieChartData = getPieChartData();
  const lineChartData = getLineChartData();
  const summaryData = getSummaryData();
  const currentTypeCategories = categories.filter(cat => cat.type === cashType);

  // ORIGINAL TOTAL LOGIC RESTORED
  const totalTallyCash = expenseData
    .filter(expense => expense.type === "tally")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalToShow =
    cashType === "petty"
      ? (localStoragePettyCashTotal !== null && localStoragePettyCashTotal > 0 ? localStoragePettyCashTotal : summaryData.total)
      : cashType === "tally"
      ? totalTallyCash
      : summaryData.total;

  return (
    <div className="space-y-6 relative pb-32"> {/* ==== FIXED: Added pb-32 for footer spacing ==== */}
      {/* ==== FIXED: Loading only on charts section === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Type</label>
            <select
              value={cashType}
              onChange={(e) => setCashType(e.target.value as "petty" | "tally")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-semibold bg-white"
            >
              <option value="petty">Petty Cash</option>
              <option value="tally">Tally Cash</option>
            </select>
          </div>
          
          {cashType === "tally" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tally Sheet</label>
              <select
                value={selectedTallySheet}
                onChange={(e) => setSelectedTallySheet(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
              >
                {tallySheets.map(sheet => (
                  <option key={sheet} value={sheet}>{sheet}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              max={dateTo}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent text-left bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-all"
              >
                <span>
                  {selectedCategories.length === 0 || selectedCategories.includes("all")
                    ? "All Categories"
                    : `${selectedCategories.length} selected`}
                </span>
                <svg className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-800">Select Categories</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSelectAll}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 font-medium transition-colors"
                        >
                          <FaCheck className="inline w-3 h-3 mr-1" /> All
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 font-medium transition-colors"
                        >
                          <FaTimes className="inline w-3 h-3 mr-1" /> Clear
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes("all")}
                        onChange={() => handleCategoryCheckboxChange("all")}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">All Categories</span>
                    </label>
                    {currentTypeCategories.map(category => (
                      <label key={category.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => handleCategoryCheckboxChange(category.name)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">View Type</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as "daily" | "weekly" | "monthly")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts - LOADING ONLY HERE */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2a5298]"></div>
              <span className="font-semibold text-gray-700">Loading charts...</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FaChartPie className="text-[#2a5298] text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Expense by Category</h3>
                <p className="text-sm text-gray-600">
                  {cashType === "petty" ? "Petty Cash" : "Tally Cash"} Distribution
                  {cashType === "tally" && selectedTallySheet !== "All" && ` - ${selectedTallySheet}`}
                </p>
              </div>
            </div>
            <div className="h-[300px] md:h-[350px] bg-gray-50 rounded-lg flex items-center justify-center">
              {pieChartData.labels.length > 0 ? (
                <Pie data={pieChartData} options={pieOptions} />
              ) : (
                <div className="text-center text-gray-500">
                  <FaChartPie className="mx-auto text-4xl mb-2 opacity-40" />
                  <p>No data available for selected filters</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <FaChartLine className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Expense Trend ({viewType})</h3>
                <p className="text-sm text-gray-600">
                  {cashType === "petty" ? "Petty Cash" : "Tally Cash"} over time
                  {cashType === "tally" && selectedTallySheet !== "All" && ` - ${selectedTallySheet}`}
                </p>
              </div>
            </div>
            <div className="h-[300px] md:h-[350px] bg-gray-50 rounded-lg flex items-center justify-center">
              {lineChartData.labels.length > 0 ? (
                <Line data={lineChartData} options={lineOptions} />
              ) : (
                <div className="text-center text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-2 opacity-40" />
                  <p>No data available for selected filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Export Reports</h3>
            <p className="text-sm text-gray-600">
              Download your {cashType === "petty" ? "Petty Cash" : "Tally Cash"} reports
              {cashType === "tally" && selectedTallySheet !== "All" && ` - ${selectedTallySheet}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaFilePdf className="text-lg" /> Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaFileExcel className="text-lg" /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics - ORIGINAL CARD LOGIC RESTORED */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Summary Statistics - {cashType === "petty" ? "Petty Cash" : "Tally Cash"} ({viewType})
          {cashType === "tally" && selectedTallySheet !== "All" && ` - ${selectedTallySheet}`}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-700">
              ₹{totalToShow.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">
              Avg. {viewType === 'daily' ? 'Daily' : viewType === 'weekly' ? 'Weekly' : 'Monthly'}
            </p>
            <p className="text-2xl font-bold text-green-700">
              ₹{summaryData.avgPeriod.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600 mb-1">
              Highest {viewType === 'daily' ? 'Day' : viewType === 'weekly' ? 'Week' : 'Month'}
            </p>
            <p className="text-2xl font-bold text-yellow-700">
              ₹{summaryData.highest.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-2xl font-bold text-purple-700">
              {summaryData.categories}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

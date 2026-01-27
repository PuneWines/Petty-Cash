
import { useState, useEffect, useCallback, useMemo ,useRef } from "react";
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
  FaChartPie,
  FaChartLine,
  FaCheck,
  FaTimes,
  FaUndo,
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


const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
  
  const [cashType, setCashType] = useState<"petty" | "tally">("petty");
  const [viewType, setViewType] = useState<"default" | "daily" | "weekly" | "monthly">("default");
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState<{ name: string; role: string } | null>(null);
  const [selectedTallySheet, setSelectedTallySheet] = useState<string>("All");



  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Dashboard Total Amount state for default values
  const [dashboardTotalAmount, setDashboardTotalAmount] = useState<number>(0);
  const [dashboardTotalTransactions, setDashboardTotalTransactions] = useState<number>(0);
  const [dashboardHighestAmount, setDashboardHighestAmount] = useState<number>(0);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current && 
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  
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
    let timeoutId: any;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };


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
    "Tea & Snacks": "G",
    "Water Jar": "H",
    "Light Bill": "I",
    "Recharge": "J",
    "Post Office": "K",
    "Customer Discount": "L",
    "Repair & Maintenance": "M",
    "Stationary": "N",
    "Petrol": "O",
    "Patil Petrol": "P",
    "Incentive": "Q",
    "Advance": "R",
    "Breakage": "T",
    "Shop Amount": "W",
    "Medical": "Y",
    "Excise/Police": "Z",
    "Desi Bhada": "AA",
    "Room Expense": "AB",
    "Office Expense": "AC",
    "Personal Expense": "AD",
    "Misc": "AE",
    "Credit Card": "AJ"
  };





  // Fetch expense data
const fetchExpenseData = useCallback(async () => {
  if (!loginUser) return;
  
  setLoading(true);
  
  try {
    if (cashType === "petty") {
      const response = await fetch(
        `${SHEET_URL}?action=fetch&sheet=${encodeURIComponent("Patty Expence")}`
      );
      const data = await response.json();
      
      if (data.success && data.data) {
        // Skip header rows
        const dataRows = data.data.slice(2);
        
        let filteredRows = dataRows.filter((row: any) => {
          if (!row || row.length < 5) return false;
          const col1 = row[1] ? row[1].toString().trim().toLowerCase() : "";
          const col2 = row[2] ? row[2].toString().trim().toLowerCase() : "";
          return col1 !== 'total' && col2 !== 'total';
        });

        if (loginUser.role.toLowerCase() !== 'admin') {
          filteredRows = filteredRows.filter(
            (row: any) => row[36] && row[36].toString().trim().toLowerCase() === loginUser.name.toLowerCase()
          );
        }

        const currentMonth = new Date().toISOString().slice(0, 7);
        const expenses: ExpenseData[] = [];
        
        filteredRows.forEach((row: any) => {
          const date = normalizeToISO(row[2] || "");
          if (!date) return;
          
          if (dateFrom && dateTo) {
            if (date < dateFrom || date > dateTo) return;
          } else if (!dateFrom && !dateTo) {
            if (!date.startsWith(currentMonth)) return;
          }

          Object.entries(columnMapping).forEach(([categoryName, columnLetter]) => {
            const colIdx = columnLetter.length === 1 
              ? columnLetter.charCodeAt(0) - 65 
              : (columnLetter.charCodeAt(0) - 64) * 26 + (columnLetter.charCodeAt(1) - 65);
            
            const amount = parseFloat(row[colIdx]) || 0;
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
      }
 else {
        setExpenseData([]);
      }
    } else {
      const sheetsToFetch = selectedTallySheet === "All" 
        ? tallySheets.filter(sheet => sheet !== "All") 
        : [selectedTallySheet];

      const allExpenses: ExpenseData[] = [];
      for (const sheet of sheetsToFetch) {
        const response = await fetch(
          `${SHEET_URL}?action=fetch&sheet=${encodeURIComponent(sheet)}`
        );
        const data = await response.json();
        
        if (data.success && data.data) {
          const dataRows = data.data.slice(1); // Tally sheets usually have 1 header row
          
          let filteredRows = dataRows;
          if (loginUser.role.toLowerCase() !== 'admin') {
            filteredRows = dataRows.filter(
              (row: any) => row[3] && row[3].toString().trim().toLowerCase() === loginUser.name.toLowerCase()
            );
          }

          filteredRows.forEach((row: any) => {
            const date = normalizeToISO(row[2] || "");
            if (!date) return;
            
            if (dateFrom && dateTo) {
              if (date < dateFrom || date > dateTo) return;
            }
            
            const scanAmount = parseFloat(row[4]) || 0; // Column E
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
            
            const cashBilling = parseFloat(row[14]) || 0; // Column O
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
            
            const generalExpense = parseFloat(row[25]) || 0; // Column Z
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

// Helper to normalize dates to YYYY-MM-DD
const normalizeToISO = (dateString: string) => {
    if (!dateString) return "";
    let dateStr = dateString.toString().trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.substring(0, 10);
    const parts = dateStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
    if (parts) {
        let day = parseInt(parts[1]);
        let month = parseInt(parts[2]);
        let year = parseInt(parts[3]);
        if (year < 100) year += 2000;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    const monthMap: {[key: string]: string} = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
      'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };
    const monthParts = dateStr.match(/^(\d{1,2})[\s\-]+([A-Za-z]+)[\s\-,\.]+?(\d{4})/);
    if (monthParts) {
        const day = monthParts[1].padStart(2, '0');
        const monthName = monthParts[2].substring(0, 3).toLowerCase();
        const month = monthMap[monthName] || '01';
        const year = monthParts[3];
        return `${year}-${month}-${day}`;
    }
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return dateStr;
};




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
            { id: "1", name: "Tea & Snacks", type: "petty" },
            { id: "2", name: "Light Bill", type: "petty" },
            { id: "3", name: "Repairs", type: "petty" },
            { id: "4", name: "Gas / Water", type: "petty" },
            { id: "5", name: "Refilling", type: "petty" },
            { id: "6", name: "Cleaning", type: "petty" },
            { id: "7", name: "Stationary", type: "petty" },
            { id: "8", name: "Petrol", type: "petty" },
            { id: "9", name: "Maintenance", type: "petty" },
            { id: "10", name: "Traveling", type: "petty" },
            { id: "11", name: "Food", type: "petty" },
            { id: "12", name: "Courier", type: "petty" },
            { id: "13", name: "Medical", type: "petty" },
            { id: "14", name: "Hardware", type: "petty" },
            { id: "15", name: "Software", type: "petty" },
            { id: "16", name: "Subscription", type: "petty" },
            { id: "17", name: "Marketing", type: "petty" },
            { id: "18", name: "Office Supplies", type: "petty" },
            { id: "19", name: "Legal", type: "petty" },
            { id: "20", name: "Audit", type: "petty" },
            { id: "21", name: "Consulting", type: "petty" },
            { id: "22", name: "Professional Fees", type: "petty" },
            { id: "23", name: "Taxes", type: "petty" },
            { id: "24", name: "Insurance", type: "petty" },
            { id: "25", name: "Misc", type: "petty" },
            { id: "26", name: "Wages", type: "petty" },
            { id: "27", name: "Scan Amount", type: "tally" },
            { id: "28", name: "Cash Billing", type: "tally" },
            { id: "29", name: "General Expense", type: "tally" },
          ]);
        }
      } catch {
        setCategories([
          { id: "1", name: "Tea & Snacks", type: "petty" },
          { id: "2", name: "Light Bill", type: "petty" },
          { id: "3", name: "Repairs", type: "petty" },
          { id: "4", name: "Gas / Water", type: "petty" },
          { id: "5", name: "Refilling", type: "petty" },
          { id: "6", name: "Cleaning", type: "petty" },
          { id: "7", name: "Stationary", type: "petty" },
          { id: "8", name: "Petrol", type: "petty" },
          { id: "9", name: "Maintenance", type: "petty" },
          { id: "10", name: "Traveling", type: "petty" },
          { id: "11", name: "Food", type: "petty" },
          { id: "12", name: "Courier", type: "petty" },
          { id: "13", name: "Medical", type: "petty" },
          { id: "14", name: "Hardware", type: "petty" },
          { id: "15", name: "Software", type: "petty" },
          { id: "16", name: "Subscription", type: "petty" },
          { id: "17", name: "Marketing", type: "petty" },
          { id: "18", name: "Office Supplies", type: "petty" },
          { id: "19", name: "Legal", type: "petty" },
          { id: "20", name: "Audit", type: "petty" },
          { id: "21", name: "Consulting", type: "petty" },
          { id: "22", name: "Professional Fees", type: "petty" },
          { id: "23", name: "Taxes", type: "petty" },
          { id: "24", name: "Insurance", type: "petty" },
          { id: "25", name: "Misc", type: "petty" },
          { id: "26", name: "Wages", type: "petty" },
          { id: "27", name: "Scan Amount", type: "tally" },
          { id: "28", name: "Cash Billing", type: "tally" },
          { id: "29", name: "General Expense", type: "tally" },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Dashboard Total Amount on mount
  useEffect(() => {
    const fetchDashboardTotals = async () => {
      try {
        const response = await fetch(
          `${SHEET_URL}?action=fetch&sheet=${encodeURIComponent("Patty Expence")}`
        );
        const data = await response.json();
        
        if (data.success && data.data) {
          const dataRows = data.data;
          const currentMonth = new Date().toISOString().slice(0, 7);
          
          let totalAmount = 0;
          let transactionCount = 0;
          let highestAmount = 0;
          
          dataRows.forEach((row: any[]) => {
            if (!row || row.length < 5) return;
            
            // Skip total rows and header
            const col1 = row[1] ? row[1].toString().trim().toLowerCase() : "";
            const col2 = row[2] ? row[2].toString().trim().toLowerCase() : "";
            if (col1 === 'total' || col2 === 'total' || col2 === 'date') return;
            
            const normalizedDate = normalizeToISO(col2);
            if (!normalizedDate || !normalizedDate.startsWith(currentMonth)) return;
            
            // Sum columns G to AE (indices 6-30) + AJ (index 35)

            let rowSum = 0;
            for (let i = 6; i <= 30; i++) {
              rowSum += parseFloat(row[i]) || 0;
            }
            rowSum += parseFloat(row[35]) || 0;
            
            if (rowSum > 0) {
              totalAmount += rowSum;
              transactionCount++;
              if (rowSum > highestAmount) {
                highestAmount = rowSum;
              }
            }
          });
          
          setDashboardTotalAmount(totalAmount);
          setDashboardTotalTransactions(transactionCount);
          setDashboardHighestAmount(highestAmount);
        }
      } catch (err) {
        console.error("Error fetching dashboard totals:", err);
      }
    };
    
    fetchDashboardTotals();
  }, []);



  useEffect(() => {
    if (cashType === "petty") {
      setSelectedCategories(["Tea & Snacks", "Light Bill", "Stationary", "Petrol"]);
    } else {
      setSelectedCategories(["all"]);
    }
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



const filteredData = expenseData.filter(expense => {
  const matchesType = expense.type === cashType;
  
  let matchesDate = true;
  if (dateFrom && dateTo) {
    matchesDate = expense.date >= dateFrom && expense.date <= dateTo;
  }
  
  const matchesCategory = selectedCategories.length === 0 || 
    selectedCategories.includes("all") ||
    selectedCategories.includes(expense.category);
  
  return matchesType && matchesDate && matchesCategory;
});

  const handleResetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCashType("petty");
    setSelectedTallySheet("All");
    setSelectedCategories(["Tea & Snacks", "Light Bill", "Stationary", "Petrol"]);
    setViewType("default");
  };




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
    "Tea & Snacks": { bg: "rgba(107, 114, 128, 0.8)", border: "rgba(107, 114, 128, 1)" }, // Gray
    "Light Bill": { bg: "rgba(52, 211, 153, 0.8)", border: "rgba(52, 211, 153, 1)" }, // Emerald
    "Stationary": { bg: "rgba(251, 191, 36, 0.8)", border: "rgba(251, 191, 36, 1)" }, // Amber
    "Petrol": { bg: "rgba(59, 130, 246, 0.8)", border: "rgba(59, 130, 246, 1)" }, // Blue
    "Repair & Maintenance": { bg: "rgba(248, 113, 113, 0.8)", border: "rgba(248, 113, 113, 1)" }, // Red
    "Water Jar": { bg: "rgba(34, 211, 238, 0.8)", border: "rgba(34, 211, 238, 1)" }, // Cyan
    "Incentive": { bg: "rgba(167, 139, 250, 0.8)", border: "rgba(167, 139, 250, 1)" }, // Violet
    "Advance": { bg: "rgba(251, 113, 133, 0.8)", border: "rgba(251, 113, 133, 1)" }, // Rose
    "Scanning": { bg: "rgba(42, 82, 152, 0.8)", border: "rgba(42, 82, 152, 1)" }, // Brand Blue
    "Scan Amount": { bg: "rgba(42, 82, 152, 0.8)", border: "rgba(42, 82, 152, 1)" },
    "Cash Billing": { bg: "rgba(236, 72, 153, 0.8)", border: "rgba(236, 72, 153, 1)" },
    "General Expense": { bg: "rgba(34, 197, 94, 0.8)", border: "rgba(34, 197, 94, 1)" },
    "Misc": { bg: "rgba(148, 163, 184, 0.8)", border: "rgba(148, 163, 184, 1)" },
  });

  const getPieChartData = () => {
    const categoryTotals: { [key: string]: number } = {};
    filteredData.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    // Sort categories by amount descending
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a);
      
    const labels = sortedCategories.map(([cat]) => cat);
    const dataValues = sortedCategories.map(([, amt]) => amt);
    
    const categoryColors = getCategoryColors();
    const backgroundColors = labels.map(category => 
      categoryColors[category as keyof ReturnType<typeof getCategoryColors>]?.bg || 
      `hsla(${Math.random() * 360}, 60%, 60%, 0.8)`
    );
    const borderColors = labels.map(category => 
      categoryColors[category as keyof ReturnType<typeof getCategoryColors>]?.border || 
      `hsla(${Math.random() * 360}, 60%, 50%, 1)`
    );
    
    return {
      labels,
      datasets: [{
        label: "Expenses by Category",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      }],
    };
  };


  const getLineChartData = () => {
    let groupedData: { [key: string]: { amount: number, sortKey: string } } = {};
    
    filteredData.forEach(expense => {
      let label = "";
      let sortKey = "";
      
      if (viewType === "daily") {
        label = expense.date; // already YYYY-MM-DD
        sortKey = expense.date;
      } else if (viewType === "weekly") {
        label = getWeekNumber(expense.date);
        // Use year + week for sort key
        const date = new Date(expense.date);
        const weekNum = getWeekNumber(expense.date).replace("Week ", "").padStart(2, '0');
        sortKey = `${date.getFullYear()}-${weekNum}`;
      } else {
        label = getMonthFromDate(expense.date);
        // Use year + month index for sort key
        const date = new Date(expense.date);
        sortKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (!groupedData[label]) {
        groupedData[label] = { amount: 0, sortKey };
      }
      groupedData[label].amount += expense.amount;
    });

    // Sort labels chronologically using the sortKey
    const sortedEntries = Object.entries(groupedData).sort((a, b) => 
      a[1].sortKey.localeCompare(b[1].sortKey)
    );
    
    const labels = sortedEntries.map(entry => entry[0]);
    const values = sortedEntries.map(entry => entry[1].amount);
    
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

  const getSummaryData = () => {
    // STEP 1: Always pre-group by Date (Fundamental Transaction Unit)
    const dailyTotals: { [key: string]: number } = {};
    filteredData.forEach(expense => {
      dailyTotals[expense.date] = (dailyTotals[expense.date] || 0) + expense.amount;
    });

    const totalSum = Object.values(dailyTotals).reduce((sum, val) => sum + val, 0);

    // STEP 2: Conditional Override Logic (Fast-path for Dashboard Totals)
    const isDateFiltered = dateFrom !== "" || dateTo !== "";
    const isViewFiltered = viewType !== "default";
    const defaultCategories = ["Tea & Snacks", "Light Bill", "Stationary", "Petrol"];
    const isCategoryFiltered = !(
      selectedCategories.length === 0 || 
      selectedCategories.includes("all") || 
      (selectedCategories.length === defaultCategories.length && defaultCategories.every(c => selectedCategories.includes(c)))
    );

    // Business Rule: Use Dashboard totals ONLY if it's the absolute default state
    if (!isDateFiltered && !isViewFiltered && !isCategoryFiltered && cashType === "petty" && dashboardTotalAmount > 0) {
      const avgExpense = dashboardTotalTransactions > 0 ? dashboardTotalAmount / dashboardTotalTransactions : 0;
      return {
        total: dashboardTotalAmount,
        avgPeriod: avgExpense,
        highest: dashboardHighestAmount,
        categories: categories.filter(c => c.type === "petty").length || 5,
        periods: dashboardTotalTransactions
      };
    }

    // STEP 3: Calculated periodic aggregation (Full Range)
    const periodTotals: { [key: string]: number } = {};
    Object.entries(dailyTotals).forEach(([dateStr, dailyAmount]) => {
      let periodKey = "";
      if (viewType === "daily" || viewType === "default") {
        periodKey = dateStr;
      } else if (viewType === "weekly") {
        periodKey = getWeekNumber(dateStr);
      } else {
        periodKey = getMonthFromDate(dateStr);
      }
      periodTotals[periodKey] = (periodTotals[periodKey] || 0) + dailyAmount;
    });

    const periodsArray = Object.values(periodTotals);
    const periodsCount = periodsArray.length;
    
    // STEP 4: Anchored Slice Calculation (New Business Requirement)
    // Anchor Date: dateFrom
    // Window: 1 day (daily), 7 days (weekly), full range (monthly)
    let rangeSum = 0;
    let rangeHighest = 0;
    const rangeCategories = new Set<string>();

    if (dateFrom) {
      const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const start = new Date(dateFrom);
      let end = new Date(start);

      if (viewType === "daily") {
        end = new Date(start);
      } else if (viewType === "weekly") {
        end.setDate(start.getDate() + 6);
      } else if (viewType === "monthly") {
        end = dateTo ? new Date(dateTo) : new Date();
      }

      const startStr = dateFrom;
      const endStr = formatDate(end);

      // Slice from filteredData for total and categories
      filteredData.forEach(expense => {
        if (expense.date >= startStr && expense.date <= endStr) {
          rangeSum += expense.amount;
          rangeCategories.add(expense.category);
        }
      });

      // Slice from dailyTotals for highest record
      Object.entries(dailyTotals).forEach(([dateStr, dailyAmount]) => {
        if (dateStr >= startStr && dateStr <= endStr) {
          if (dailyAmount > rangeHighest) rangeHighest = dailyAmount;
        }
      });
    }

    return { 
      total: rangeSum, // Period Total (Anchored Slice)
      avgPeriod: periodsCount > 0 ? totalSum / periodsCount : 0, // Overall Average (Unchanged)
      highest: rangeHighest, // Peak Daily Total within slice
      categories: rangeCategories.size, // Categories within slice
      periods: periodsCount 
    };
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


  const pieChartData = getPieChartData();
  const lineChartData = getLineChartData();
  const summaryData = getSummaryData();
  const currentTypeCategories = categories.filter(cat => cat.type === cashType);


  return (
    <div className="space-y-6 relative pb-32">
      {/* 1. Reports & Analytics Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          {viewType !== "default" && (
            <button 
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 shadow-sm hover:shadow-md active:scale-95 animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <FaUndo className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${cashType === "tally" ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-4`}>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Type</label>
            <select
              value={cashType}
              onChange={(e) => setCashType(e.target.value as "petty" | "tally")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-medium bg-white h-[46px] shadow-sm transition-all"
            >
              <option value="petty">Petty Cash</option>
              <option value="tally">Tally Cash</option>
            </select>
          </div>
          
          {cashType === "tally" && (
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tally Sheet</label>
              <select
                value={selectedTallySheet}
                onChange={(e) => setSelectedTallySheet(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-medium bg-white h-[46px] shadow-sm transition-all"
              >
                {tallySheets.map(sheet => (
                  <option key={sheet} value={sheet}>{sheet}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              max={dateTo}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-medium bg-white h-[46px] shadow-sm transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-medium bg-white h-[46px] shadow-sm transition-all"
            />
          </div>
          <div className="flex flex-col relative" ref={categoryDropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category {selectedCategories.length > 0 && !selectedCategories.includes("all") && `(${selectedCategories.length})`}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent text-left bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-all font-medium h-[46px]"
              >
                <span className="truncate mr-2">
                  {selectedCategories.length === 0
                    ? "Select Category"  
                    : selectedCategories.includes("all")
                    ? "All Categories"
                    : `${selectedCategories.length} selected`}
                </span>
                <svg className={`shrink-0 w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-800">Filter</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSelectAll}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 font-medium transition-colors"
                        >
                          All
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 font-medium transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
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
          
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-2">View Type</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as "default" | "daily" | "weekly" | "monthly")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-medium bg-white h-[46px] shadow-sm transition-all"
            >
              <option value="default">Select View Type</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Summary Statistics Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Summary Statistics - {cashType === "petty" ? "Petty Cash" : "Tally Cash"}
          {cashType === "tally" && selectedTallySheet !== "All" && ` - ${selectedTallySheet}`}
        </h3>

        {filteredData.length === 0 && viewType !== "default" ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-lg font-medium">No data found for the selected filters</p>
            <p className="text-sm">Try adjusting your date range or categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-700">
                ₹{Math.round(summaryData.total).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Avg. Transaction</p>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(summaryData.avgPeriod).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">Highest Record</p>
              <p className="text-2xl font-bold text-yellow-700">
                ₹{Math.round(summaryData.highest).toLocaleString("en-IN")}
              </p>
            </div>


            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-purple-700">
                {summaryData.categories}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Charts Section */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-3 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
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
            <div className="h-[300px] md:h-[350px] bg-gray-50 rounded-lg flex items-center justify-center p-4">
              {pieChartData.labels.length > 0 ? (
                <Pie data={pieChartData} options={pieOptions} />
              ) : (
                <div className="text-center text-gray-500">
                  <FaChartPie className="mx-auto text-4xl mb-2 opacity-40" />
                  <p>
                    {(!dateFrom || !dateTo) && expenseData.length === 0 
                      ? "Loading data..." 
                      : "No data available for selected filters"}
                  </p>
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
                <h3 className="text-xl font-bold text-gray-800 mb-1">Expense Trend</h3>

                <p className="text-sm text-gray-600">
                  {cashType === "petty" ? "Petty Cash" : "Tally Cash"} over time
                  {cashType === "tally" && selectedTallySheet !== "All" && ` - ${selectedTallySheet}`}
                </p>
              </div>
            </div>
            <div className="h-[300px] md:h-[350px] bg-gray-50 rounded-lg flex items-center justify-center p-4">
              {lineChartData.labels.length > 0 ? (
                <Line data={lineChartData} options={lineOptions} />
              ) : (
                <div className="text-center text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-2 opacity-40" />
                  <p>
                    {!dateFrom || !dateTo 
                      ? "Select date range to filter data" 
                      : "No data available for selected filters"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

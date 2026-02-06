


import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { FaTimes, FaUser, FaShoppingCart, FaTruck, FaPlus } from "react-icons/fa";

interface CashTallyProps {
  isOpen?: boolean;
  onClose?: () => void;
  counter?: number;
  initialData?: any;
}

export default function CashTally({
  isOpen = true,
  onClose = () => { },
  counter = 1,
  initialData,
}: CashTallyProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    shopName: "",
    retailScanAmount: "",
    retail500: "",
    retail200: "",
    retail100: "",
    retail50: "",
    retail20: "",
    retail10: "",
    retail1: "",
    retailGpay: "",
    retailCard: "",
    retailPhonePe: "",
    retailPaytm: "",
    expense: "",
    wsCashBillingAmount: "",
    wsCreditBillingAmount: "",
    wsCreditReceipt: "",
    ws500: "",
    ws200: "",
    ws100: "",
    ws50: "",
    ws20: "",
    ws10: "",
    ws1: "",
    wsGpayCard: "",
    wsPhonePe: "",
    wsPaytm: "",
    wsCard: "",
    homeDelivery: "",
    retail1500: "",
    retail2200: "",
    retail3100: "",
    retail450: "",
    retail520: "",
    retail610: "",
    retail71: "",
    expenseGpayCard: "",
    voidSale: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<string[]>([]);
  const [fetchedShopNames, setFetchedShopNames] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const fetchEmployees = async () => {
    try {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";
      const response = await fetch(`${scriptUrl}?sheetName=Login&action=getSheetData`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const employeeNames = result.data.map((row: any[]) => row[0]).filter((name: string) => !!name);
        setEmployees(employeeNames);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchShopNames = async () => {
    try {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";
      const response = await fetch(`${scriptUrl}?sheetName=Master&action=getSheetData`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Master sheet Column D is index 3. 
        // We do not slice(1) here.
        // API appears to be missing the first data row ("KUNAL ULWE"), so we merge it manually just in case
        let shopNames = result.data
          .map((row: any[]) => row[3]) // Column D
          .filter((name: string) => !!name && name.toLowerCase() !== "shop name");

        // Explicitly ensure 'KUNAL ULWE' is present if missing or if API skipped it
        shopNames = ["KUNAL ULWE", ...shopNames];

        // Remove duplicates
        const uniqueShops = Array.from(new Set(shopNames)) as string[];

        setFetchedShopNames(uniqueShops);
      }
    } catch (error) {
      console.error("Error fetching shop names:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          name: "",
          shopName: "",
          retailScanAmount: "",
          retail500: "",
          retail200: "",
          retail100: "",
          retail50: "",
          retail20: "",
          retail10: "",
          retail1: "",
          retailGpay: "",
          retailCard: "",
          retailPhonePe: "",
          retailPaytm: "",
          expense: "",
          wsCashBillingAmount: "",
          wsCreditBillingAmount: "",
          wsCreditReceipt: "",
          ws500: "",
          ws200: "",
          ws100: "",
          ws50: "",
          ws20: "",
          ws10: "",
          ws1: "",
          wsGpayCard: "",
          wsPhonePe: "",
          wsPaytm: "",
          wsCard: "",
          homeDelivery: "",
          retail1500: "",
          retail2200: "",
          retail3100: "",
          retail450: "",
          retail520: "",
          retail610: "",
          retail71: "",
          expenseGpayCard: "",
          voidSale: "",
        });
      } fetchEmployees();
      fetchShopNames();
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const sum = [
      parseFloat(formData.retailScanAmount) || 0,
      parseFloat(formData.retail500) || 0,
      parseFloat(formData.retail200) || 0,
      parseFloat(formData.retail100) || 0,
      parseFloat(formData.retail50) || 0,
      parseFloat(formData.retail20) || 0,
      parseFloat(formData.retail10) || 0,
      parseFloat(formData.retail1) || 0,
      parseFloat(formData.retailGpay) || 0,
      parseFloat(formData.retailCard) || 0,
      parseFloat(formData.retailPhonePe) || 0,
      parseFloat(formData.retailPaytm) || 0,
      parseFloat(formData.expense) || 0,
      parseFloat(formData.wsCashBillingAmount) || 0,
      parseFloat(formData.wsCreditBillingAmount) || 0,
      parseFloat(formData.wsCreditReceipt) || 0,
      parseFloat(formData.ws500) || 0,
      parseFloat(formData.ws200) || 0,
      parseFloat(formData.ws100) || 0,
      parseFloat(formData.ws50) || 0,
      parseFloat(formData.ws20) || 0,
      parseFloat(formData.ws10) || 0,
      parseFloat(formData.ws1) || 0,
      parseFloat(formData.wsGpayCard) || 0,
      parseFloat(formData.wsPhonePe) || 0,
      parseFloat(formData.wsPaytm) || 0,
      parseFloat(formData.wsCard) || 0,
      parseFloat(formData.homeDelivery) || 0,
      parseFloat(formData.retail1500) || 0,
      parseFloat(formData.retail2200) || 0,
      parseFloat(formData.retail3100) || 0,
      parseFloat(formData.retail450) || 0,
      parseFloat(formData.retail520) || 0,
      parseFloat(formData.retail610) || 0,
      parseFloat(formData.retail71) || 0,
      parseFloat(formData.expenseGpayCard) || 0,
      parseFloat(formData.voidSale) || 0,
    ].reduce((acc, val) => acc + val, 0);
    setTotalAmount(sum);
  }, [formData]);








  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      // Generate Cash Tally ID
      const sheetName = `Cash Tally Counter ${counter}`;
      const scriptUrl = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";

      let generatedId = '';

      try {
        // Fetch the last ID from the sheet
        const idResponse = await fetch(`${scriptUrl}?sheetName=${encodeURIComponent(sheetName)}&action=getLastId`);
        const idResult = await idResponse.json();

        if (idResult.success && idResult.lastId) {
          const lastNumber = parseInt(idResult.lastId.split('-')[1]) || 0;
          generatedId = `CT-${String(lastNumber + 1).padStart(2, '0')}`;
        } else {
          generatedId = `CT-01`;
        }
      } catch (error) {
        console.error("Error generating ID:", error);
        generatedId = `CT-01`;
      }


      const rowData = [
        timestamp,                      // Column A: Timestamp (auto-generated)
        generatedId,                    // Column B: Cash Tally ID
        formData.date,                  // Column C: Date
        formData.name,                  // Column D: Employee Name
        formData.shopName,              // Column E: Shop Name
        formData.retailScanAmount,      // Column F: Scan Amount
        formData.retail500,
        formData.retail200,
        formData.retail100,
        formData.retail50,
        formData.retail20,
        formData.retail10,
        formData.retail1,
        formData.retailGpay,
        formData.retailPhonePe,
        formData.retailPaytm,
        formData.retailCard,
        formData.wsCashBillingAmount,
        formData.wsCreditBillingAmount,
        formData.wsCreditReceipt,
        formData.ws500,
        formData.ws200,
        formData.ws100,
        formData.ws50,
        formData.ws20,
        formData.ws10,
        formData.ws1,
        formData.wsGpayCard,
        formData.wsPhonePe,
        formData.wsPaytm,
        formData.wsCard,
        formData.expense,
        formData.homeDelivery,
        formData.retail1500,
        formData.retail2200,
        formData.retail3100,
        formData.retail450,
        formData.retail520,
        formData.retail610,
        formData.retail71,
        formData.voidSale,              // Column AO: Void Sale
        formData.expenseGpayCard        // Column AP: Expense GPay/Card
      ];



      const formDataToSend = new URLSearchParams({
        sheetName: sheetName,
        action: "insert",
        rowData: JSON.stringify(rowData)
      });

      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        const existingEntries = JSON.parse(
          localStorage.getItem("cashTallyEntries") || "[]"
        );

        if (initialData) {
          const updatedEntries = existingEntries.map((entry: any) =>
            entry.id === initialData.id ? { ...formData, id: initialData.id } : entry
          );
          localStorage.setItem("cashTallyEntries", JSON.stringify(updatedEntries));
        } else {
          const newEntry = { id: Date.now().toString(), ...formData };
          localStorage.setItem(
            "cashTallyEntries",
            JSON.stringify([newEntry, ...existingEntries])
          );
        }

        setToast({ message: "Data saved successfully!", type: "success" });
        setTimeout(() => {
          onClose();
          setIsLoading(false);
        }, 1000);
      } else {
        console.error("Error:", result.error);
        setToast({ message: "Failed to save data: " + result.error, type: "error" });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({ message: "Error submitting form. Please try again.", type: "error" });
      setIsLoading(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#f5f7fa] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#f5f7fa] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Cash Tally - Counter {counter}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#2a5298] p-2 rounded-lg">
                  <FaUser className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                    required
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp, index) => (
                      <option key={index} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shop Name
                  </label>
                  <select
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select Shop Name</option>
                    {fetchedShopNames.map((shop, index) => (
                      <option key={index} value={shop}>{shop}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Retail Transactions */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FaShoppingCart className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Retail Transactions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scan Amount</label>
                  <input
                    type="text"
                    name="retailScanAmount"
                    value={formData.retailScanAmount}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Denominations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹500</label>
                      <input
                        type="text"
                        name="retail500"
                        value={formData.retail500}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹200</label>
                      <input
                        type="text"
                        name="retail200"
                        value={formData.retail200}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹100</label>
                      <input
                        type="text"
                        name="retail100"
                        value={formData.retail100}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹50</label>
                      <input
                        type="text"
                        name="retail50"
                        value={formData.retail50}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹20</label>
                      <input
                        type="text"
                        name="retail20"
                        value={formData.retail20}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹10</label>
                      <input
                        type="text"
                        name="retail10"
                        value={formData.retail10}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹1</label>
                      <input
                        type="text"
                        name="retail1"
                        value={formData.retail1}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GPay/UPI</label>
                  <input
                    type="text"
                    name="retailGpay"
                    value={formData.retailGpay}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Payments</label>
                  <input
                    type="text"
                    name="retailCard"
                    value={formData.retailCard}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PhonePe</label>
                  <input
                    type="text"
                    name="retailPhonePe"
                    value={formData.retailPhonePe}
                    onChange={handleChange}
                    placeholder="Enter PhonePe details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Paytm</label>
                  <input
                    type="text"
                    name="retailPaytm"
                    value={formData.retailPaytm}
                    onChange={handleChange}
                    placeholder="Enter Paytm details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Wholesale Transactions */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <FaTruck className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Wholesale Transactions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Billing</label>
                  <input
                    type="text"
                    name="wsCashBillingAmount"
                    value={formData.wsCashBillingAmount}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Billing</label>
                  <input
                    type="text"
                    name="wsCreditBillingAmount"
                    value={formData.wsCreditBillingAmount}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Receipt</label>
                  <input
                    type="text"
                    name="wsCreditReceipt"
                    value={formData.wsCreditReceipt}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Denominations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹500</label>
                      <input
                        type="text"
                        name="ws500"
                        value={formData.ws500}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹200</label>
                      <input
                        type="text"
                        name="ws200"
                        value={formData.ws200}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹100</label>
                      <input
                        type="text"
                        name="ws100"
                        value={formData.ws100}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹50</label>
                      <input
                        type="text"
                        name="ws50"
                        value={formData.ws50}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹20</label>
                      <input
                        type="text"
                        name="ws20"
                        value={formData.ws20}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹10</label>
                      <input
                        type="text"
                        name="ws10"
                        value={formData.ws10}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹1</label>
                      <input
                        type="text"
                        name="ws1"
                        value={formData.ws1}
                        onChange={handleChange}
                        placeholder="0"

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GPay/Card</label>
                  <input
                    type="text"
                    name="wsGpayCard"
                    value={formData.wsGpayCard}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PhonePe</label>
                  <input
                    type="text"
                    name="wsPhonePe"
                    value={formData.wsPhonePe}
                    onChange={handleChange}
                    placeholder="Enter PhonePe details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Paytm</label>
                  <input
                    type="text"
                    name="wsPaytm"
                    value={formData.wsPaytm}
                    onChange={handleChange}
                    placeholder="Enter Paytm details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Payments</label>
                  <input
                    type="text"
                    name="wsCard"
                    value={formData.wsCard}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Expenses & Other Transactions */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <FaPlus className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Expenses & Other Transactions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">General Expense</label>
                  <input
                    type="text"
                    name="expense"
                    value={formData.expense}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Home Delivery</label>
                  <input
                    type="text"
                    name="homeDelivery"
                    value={formData.homeDelivery}
                    onChange={handleChange}
                    placeholder="0.00"

                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* Conditional Cash Denominations - Shows when Home Delivery has value */}
                {formData.homeDelivery && parseFloat(formData.homeDelivery) > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Home Delivery Cash Denominations</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹500</label>
                        <input
                          type="text"
                          name="retail1500"
                          value={formData.retail1500}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹200</label>
                        <input
                          type="text"
                          name="retail2200"
                          value={formData.retail2200}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹100</label>
                        <input
                          type="text"
                          name="retail3100"
                          value={formData.retail3100}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹50</label>
                        <input
                          type="text"
                          name="retail450"
                          value={formData.retail450}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹20</label>
                        <input
                          type="text"
                          name="retail520"
                          value={formData.retail520}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹10</label>
                        <input
                          type="text"
                          name="retail610"
                          value={formData.retail610}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">₹1</label>
                        <input
                          type="text"
                          name="retail71"
                          value={formData.retail71}
                          onChange={handleChange}
                          placeholder="0"

                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Void Sale</label>
                  <input
                    type="text"
                    name="voidSale"
                    value={formData.voidSale}
                    onChange={handleChange}
                    placeholder="0.00"


                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#f5f7fa] rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-[#2a5298]">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#2a5298] text-white rounded-lg font-semibold hover:bg-[#1e3d70] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Entry"
              )}
            </button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

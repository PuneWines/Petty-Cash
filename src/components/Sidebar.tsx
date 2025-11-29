
// import { useState, useEffect } from "react";
// import {
//   FaHome,
//   FaFileInvoice,
//   FaMoneyBillWave,
//   FaChartBar,
//   FaSignOutAlt,
//   FaChevronDown,
//   FaChevronRight,
// } from "react-icons/fa";
// import { useAuth } from "../contexts/AuthContext";

// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
//   const { logout, user } = useAuth();
//   const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
//   const [allowedPages, setAllowedPages] = useState<string[]>([]);

//   // Toggle submenu open/close
//   const toggleMenu = (menuId: string) => {
//     setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
//   };

//  // Fetch user's allowed pages from Google Sheets login sheet
//   useEffect(() => {
//     const fetchUserAccess = async () => {
//       if (!user?.name) return;

//       // If user is admin, grant access to all pages automatically
//       if (user.role?.toLowerCase() === "admin") {
//         setAllowedPages([
//           "dashboard",
//           "petty-cash",
//           "cash-tally",
//           "cash-tally-1",
//           "cash-tally-2",
//           "cash-tally-3",
//           "reports",
//         ]);
//         return;
//       }

//       try {
//         const url =
//           "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec?action=fetch&sheetName=Login";

//         const response = await fetch(url);
//         const json = await response.json();

//         if (json.success) {
//           // json.data is array of rows, each row is array of cell values
//           const userRow = json.data.find(
//             (row: string[]) => row[0].toLowerCase().trim() === user.name.toLowerCase().trim()
//           );

//           if (userRow && userRow[4]) {
//             // Column E contains comma separated page ids
//             const pages = userRow[4]
//               .split(",")
//               .map((page: string) => page.trim().toLowerCase());
//             setAllowedPages(pages);
//           } else {
//             // No access found or user row missing - clear allowedPages
//             setAllowedPages([]);
//           }
//         } else {
//           console.error("Failed to fetch user access data");
//           setAllowedPages([]);
//         }
//       } catch (error) {
//         console.error("Error fetching user access:", error);
//         setAllowedPages([]);
//       }
//     };

//     fetchUserAccess();
//   }, [user]);

//   // Define menu items - ids must match access page ids from sheet (lowercase)
//   const menuItems = [
//     { id: "dashboard", icon: FaHome, label: "Dashboard" },
//     { id: "petty-cash", icon: FaFileInvoice, label: "Petty Cash Form" },
//     { id: "cash-tally", icon: FaMoneyBillWave, label: "Cash Tally", hasSubmenu: true },
//     { id: "reports", icon: FaChartBar, label: "Reports" },
//   ];

//   const submenuItems = [
//     { id: "cash-tally-1", label: "Counter 1", parent: "cash-tally" },
//     { id: "cash-tally-2", label: "Counter 2", parent: "cash-tally" },
//     { id: "cash-tally-3", label: "Counter 3", parent: "cash-tally" },
//   ];

//   return (
//     <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 hidden lg:block">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="bg-[#2a5298] p-3 rounded-lg">
//             <FaMoneyBillWave className="text-white text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">Petty Cash</h1>
//             <p className="text-xs text-gray-500">Management System</p>
//           </div>
//         </div>
//         {user && (
//           <div className="flex items-center gap-3">
//             <div className="bg-gray-100 p-2 rounded-full w-10 h-10 flex items-center justify-center">
//               <span className="text-sm font-semibold text-gray-700">
//                 {user.initials}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-800">{user.name}</p>
//               <p className="text-xs text-gray-500">{user.role}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       <nav className="p-4">
//         <ul className="space-y-2">
//           {menuItems.map((item) => {
//             // Only render items the user has access to
//             if (!allowedPages.includes(item.id)) return null;

//             const Icon = item.icon;
//             const isActive = activeTab === item.id;
//             const isExpanded = expandedMenus[item.id];

//             return (
//               <div key={item.id}>
//                 <button
//                   onClick={() =>
//                     item.hasSubmenu ? toggleMenu(item.id) : onTabChange(item.id)
//                   }
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? "bg-[#2a5298] text-white shadow-md"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="text-lg" />
//                   <span className="font-medium flex-1 text-left">{item.label}</span>
//                   {item.hasSubmenu &&
//                     (isExpanded ? (
//                       <FaChevronDown className="text-sm" />
//                     ) : (
//                       <FaChevronRight className="text-sm" />
//                     ))}
//                 </button>

//                 {/* Render submenu only if expanded and user has access */}
//                 {item.hasSubmenu && isExpanded && (
//                   <ul className="ml-8 mt-1 space-y-1">
//                     {submenuItems
//                       .filter((sub) => sub.parent === item.id)
//                       .filter((sub) => allowedPages.includes(sub.id))
//                       .map((subItem) => (
//                         <li key={subItem.id}>
//                           <button
//                             onClick={() => onTabChange(subItem.id)}
//                             className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
//                               activeTab === subItem.id
//                                 ? "bg-[#2a5298] text-white shadow-md"
//                                 : "text-gray-600 hover:bg-gray-100"
//                             }`}
//                           >
//                             {subItem.label}
//                           </button>
//                         </li>
//                       ))}
//                   </ul>
//                 )}
//               </div>
//             );
//           })}
//         </ul>
//       </nav>

//       <div className="absolute bottom-4 left-4 right-4">
//         <button
//           onClick={logout}
//           className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
//         >
//           <FaSignOutAlt className="text-lg" />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }



import { useState, useEffect } from "react";
import {
  FaHome,
  FaFileInvoice,
  FaMoneyBillWave,
  FaChartBar,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { logout, user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [allowedPages, setAllowedPages] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle submenu open/close
  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  // Close mobile menu when tab changes
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  // Fetch user's allowed pages from Google Sheets login sheet
  useEffect(() => {
    const fetchUserAccess = async () => {
      if (!user?.name) return;

      // If user is admin, grant access to all pages automatically
      if (user.role?.toLowerCase() === "admin") {
        setAllowedPages([
          "dashboard",
          "petty-cash",
          "cash-tally",
          "cash-tally-1",
          "cash-tally-2",
          "cash-tally-3",
          "reports",
        ]);
        return;
      }

      try {
        const url =
          "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec?action=fetch&sheetName=Login";

        const response = await fetch(url);
        const json = await response.json();

        if (json.success) {
          // json.data is array of rows, each row is array of cell values
          const userRow = json.data.find(
            (row: string[]) => row[0].toLowerCase().trim() === user.name.toLowerCase().trim()
          );

          if (userRow && userRow[4]) {
            // Column E contains comma separated page ids
            const pages = userRow[4]
              .split(",")
              .map((page: string) => page.trim().toLowerCase());
            setAllowedPages(pages);
          } else {
            // No access found or user row missing - clear allowedPages
            setAllowedPages([]);
          }
        } else {
          console.error("Failed to fetch user access data");
          setAllowedPages([]);
        }
      } catch (error) {
        console.error("Error fetching user access:", error);
        setAllowedPages([]);
      }
    };

    fetchUserAccess();
  }, [user]);

  // Define menu items - ids must match access page ids from sheet (lowercase)
  const menuItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard" },
    { id: "petty-cash", icon: FaFileInvoice, label: "Petty Cash Form" },
    { id: "cash-tally", icon: FaMoneyBillWave, label: "Cash Tally", hasSubmenu: true },
    { id: "reports", icon: FaChartBar, label: "Reports" },
  ];

  const submenuItems = [
    { id: "cash-tally-1", label: "Counter 1", parent: "cash-tally" },
    { id: "cash-tally-2", label: "Counter 2", parent: "cash-tally" },
    { id: "cash-tally-3", label: "Counter 3", parent: "cash-tally" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#2a5298] p-3 rounded-lg">
            <FaMoneyBillWave className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Petty Cash</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {user.initials}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        )}
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Only render items the user has access to
            if (!allowedPages.includes(item.id)) return null;

            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isExpanded = expandedMenus[item.id];

            return (
              <div key={item.id}>
                <button
                  onClick={() =>
                    item.hasSubmenu ? toggleMenu(item.id) : handleTabChange(item.id)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#2a5298] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu &&
                    (isExpanded ? (
                      <FaChevronDown className="text-sm" />
                    ) : (
                      <FaChevronRight className="text-sm" />
                    ))}
                </button>

                {/* Render submenu only if expanded and user has access */}
                {item.hasSubmenu && isExpanded && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {submenuItems
                      .filter((sub) => sub.parent === item.id)
                      .filter((sub) => allowedPages.includes(sub.id))
                      .map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleTabChange(subItem.id)}
                            className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              activeTab === subItem.id
                                ? "bg-[#2a5298] text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subItem.label}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#2a5298] p-2 rounded-lg">
            <FaMoneyBillWave className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Petty Cash</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 text-2xl p-2"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
import re

# Read the file
with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the finally block from fetchTransactions
# Pattern: match the finally block with setIsLoading(false)
content = re.sub(
    r'(\s+setTransactions\(allData\);\s+\} catch \(error\) \{\s+console\.error\("Error:", error\);\s+setTransactions\(\[\]\);\s+)\} finally \{\s+setIsLoading\(false\);\s+\}',
    r'\1}',
    content,
    flags=re.DOTALL
)

# Replace the useEffect to add Promise.all coordination
old_useEffect = r'''  useEffect\(\(\) => \{
    if \(!currentUser\) return;

    let sheetName;
    if \(activeTab === "patty"\) \{
      sheetName = "Patty Expence";
      fetchTransactions\(sheetName\);
      fetchStatsAndExpenses\(sheetName, currentUser\.name, currentUser\.role\);
    \} else \{
      if \(selectedTallySheet === "All"\) \{
        const sheetsToFetch = tallySheets\.filter\(s => s !== "All"\);
        fetchTransactions\(sheetsToFetch\);
        fetchMultipleTallyStats\(sheetsToFetch, currentUser\.name, currentUser\.role\);
      \} else \{
        sheetName = selectedTallySheet;
        fetchTransactions\(sheetName\);
        fetchStatsAndExpenses\(sheetName, currentUser\.name, currentUser\.role\);
      \}
    \}
  \}, \[activeTab, selectedTallySheet, currentUser\]\);'''

new_useEffect = '''  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        let sheetName;
        if (activeTab === "patty") {
          sheetName = "Patty Expence";
          await Promise.all([
            fetchTransactions(sheetName),
            fetchStatsAndExpenses(sheetName, currentUser.name, currentUser.role)
          ]);
        } else {
          if (selectedTallySheet === "All") {
            const sheetsToFetch = tallySheets.filter(s => s !== "All");
            await Promise.all([
              fetchTransactions(sheetsToFetch),
              fetchMultipleTallyStats(sheetsToFetch, currentUser.name, currentUser.role)
            ]);
          } else {
            sheetName = selectedTallySheet;
            await Promise.all([
              fetchTransactions(sheetName),
              fetchStatsAndExpenses(sheetName, currentUser.name, currentUser.role)
            ]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab, selectedTallySheet, currentUser]);'''

content = re.sub(old_useEffect, new_useEffect, content)

# Write the file back
with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated successfully!")

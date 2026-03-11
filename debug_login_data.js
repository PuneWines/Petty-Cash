
import fs from 'fs';

async function debug() {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";
  const url = `${SCRIPT_URL}?sheet=Login&action=fetch`;
  console.log("Fetching from:", url);
  try {
    const response = await fetch(url);
    const result = await response.json();
    let output = "";
    if (result.success && result.data) {
      output += "Headers: " + JSON.stringify(result.data[0]) + "\n";
      result.data.slice(1).forEach((row, i) => {
        output += `Row ${i+1}: ${JSON.stringify(row)}\n`;
      });
      fs.writeFileSync('debug_sheet_output.txt', output);
      console.log("Output written to debug_sheet_output.txt");
    } else {
      console.log("Error or no data:", result);
    }
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}
debug();

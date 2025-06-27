// lib/googleSheets.js
export async function fetchGoogleSheetData(sheetId) {
  try {
    // Public Google Sheets CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Parse CSV data
    const rows = csvText.split('\n').map(row => 
      row.split(',').map(cell => cell.replace(/"/g, '').trim())
    );
    
    // Remove header row
    const dataRows = rows.slice(1);
    
    // Convert to KPI format
    const kpis = dataRows
      .filter(row => row.length >= 6 && row[1]) // Filter valid rows
      .map((row, index) => {
        const value2024 = parseFloat(row[2]) || 0;
        const value2025 = parseFloat(row[3]) || 0;
        
        let improvement = 0;
        let isComplete = false;
        
        if (value2024 && value2025) {
          improvement = value2024 !== 0 ? ((value2025 - value2024) / value2024) * 100 : 0;
          isComplete = true;
        }
        
        return {
          id: index + 1,
          section: row[0] || 'غير محدد',
          kpiName: row[1] || `مؤشر ${index + 1}`,
          value2024: value2024,
          value2025: value2025,
          improvement: improvement,
          department: row[5] || 'غير محدد',
          isComplete: isComplete,
          status: improvement > 10 ? 'ممتاز' : improvement > 0 ? 'جيد' : 'يحتاج تحسين'
        };
      });
    
    return {
      kpis: kpis,
      departments: ["الإعلام", "التسويق", "السمعة", "التشريفات", "الاتصال"],
      sections: ["الأنشطة", "المخرجات", "النتائج", "الأثر"],
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

export function extractSheetId(url) {
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

import { readFileSync } from 'fs';

// Read the report file
const report = JSON.parse(readFileSync('validation-results/manual-validation-report-1743347425735.json'));

// Extract data
console.log("=== Validation Report Analysis ===");
console.log(`Total Cycles: ${report.summary.cycles}`);
console.log(`QCTF Average: ${report.summary.qctfAverage}`);
console.log(`System Coherence Average: ${report.summary.systemCoherenceAverage}`);
console.log("\n=== Cycle Details ===");

// Loop through history
report.details.systemState.history.forEach((entry, index) => {
  const cycle = index + 1;
  const variants = entry.state && entry.state.variantCount ? entry.state.variantCount : 'N/A';
  const qctf = entry.qctfValue ? entry.qctfValue.toFixed(4) : 'N/A';
  const coherence = entry.systemCoherence ? entry.systemCoherence.toFixed(4) : 'N/A';
  
  console.log(`Cycle ${cycle}: QCTF=${qctf}, Coherence=${coherence}, Variants=${variants}`);
});
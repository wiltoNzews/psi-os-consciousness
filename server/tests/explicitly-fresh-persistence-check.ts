// explicitly-fresh-persistence-check.ts
import { FileSystemStorage } from '../services/file-system-storage.js';

(async () => {
  const storage = new FileSystemStorage('./fresh_test_data');
  const testMetrics = { stability: Math.random(), timestamp: new Date() };

  // Using saveQRNMetrics instead of saveMetrics to ensure data is saved in qrnMetricsDir
  await storage.saveQRNMetrics(testMetrics);
  const retrieved = await storage.getLatestQRNMetrics();

  if (retrieved?.stability === testMetrics.stability) {
    console.log("✅ Fresh Persistence explicitly verified successfully.");
  } else {
    console.error("❌ Fresh Persistence explicitly failed verification.");
    console.error(`Expected stability: ${testMetrics.stability}, got: ${retrieved?.stability}`);
    process.exit(1);
  }
})();
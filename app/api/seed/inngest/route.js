// route.js
import { serve } from "@inngest/next";
import { inngest } from "@/lib/inngest/client"; // Don't add .js if using .jsconfig alias
import {
  checkBudgetAlerts,
  generateMonthlyReports,
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/lib/inngest/function";

// Make sure you're correctly exporting the API functions
const handler = serve({
  client: inngest,
  functions: [
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,
  ],
});

// Export the HTTP methods
export const { GET, POST, PUT } = handler;

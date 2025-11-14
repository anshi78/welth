// Correct code for app/api/seed/inngest/route.js

import { serve } from "inngest/next";
// This path goes up 4 levels to the root
import { inngest } from "../../../../lib/inngest/client"; 
import {
  processRecurringTransaction,
  triggerRecurringTransactions,
  generateMonthlyReports,
  checkBudgetAlerts,
} from "../../../../lib/inngest/function"; // Also 4 levels up

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,
  ],
});
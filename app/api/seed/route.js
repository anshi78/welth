// Correct code for app/api/seed/route.js

import { serve } from "inngest/next";
// This path goes up 3 levels to the root
import { inngest } from "../../../lib/inngest/client"; 
import {
  processRecurringTransaction,
  triggerRecurringTransactions,
  generateMonthlyReports,
  checkBudgetAlerts,
} from "../../../lib/inngest/function"; // Also 3 levels up

export const { GET, POST } = serve({
  client: inngest,
  functions: [
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,
  ],
});
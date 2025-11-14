"use server";
import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "../../../actions/dashboard";

import { updateBudget, getCurrentBudget } from "../../../actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "../../../components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";


export default async function DashboardPage() {
  let accounts = [];
  let dashboardData = { transactions: [] };
  let budgetData = null;

  try {
    // Correctly destructure the results from Promise.all
    // getDashboardData() returns an object with { accounts: [], transactions: [] }
    [accounts, dashboardData] = await Promise.all([
      getUserAccounts(),
      getDashboardData(),
    ]);

    const defaultAccount = accounts?.find((account) => account.isDefault);

    // Get budget for default account
    if (defaultAccount) {
      budgetData = await getCurrentBudget(defaultAccount.id);
    }
  } catch (error) {
    // Log the error for debugging purposes in development
    console.error("Failed to fetch dashboard data:", error);
    // In production, the component will still render with empty data
  }

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        // Pass the correct transactions array from the dashboardData object
        transactions={dashboardData.transactions || []}
      />

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {/* Defensive check to ensure accounts is an array before mapping */}
        {Array.isArray(accounts) && accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  );
}

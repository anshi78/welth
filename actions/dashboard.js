"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * A helper function to serialize Decimal values to a number for client-side use.
 * @param {object} obj The object containing Decimal fields to serialize.
 * @returns {object} The serialized object.
 */
const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

/**
 * Retrieves all accounts for the current authenticated user.
 * @returns {Promise<object[]>} An array of serialized account objects.
 */
export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find the user in the database or create them if they don't exist
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error("Clerk user not found.");
    }
    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    // Check if a user with this email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      // User found by email, update their clerkUserId to link the accounts
      user = await db.user.update({
        where: { id: existingUserByEmail.id },
        data: { clerkUserId: userId },
      });
    } else {
      // No existing user found by either Clerk ID or email, so create a new one
      const name = `${clerkUser.firstName || "User"} ${clerkUser.lastName || ""}`;

      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: email,
          name: name,
        },
      });
    }
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    const serializedAccounts = accounts.map(serializeTransaction);
    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

/**
 * Creates a new account for the current authenticated user.
 * @param {object} data The account data to create.
 * @returns {Promise<object>} The result object with the serialized account data.
 */
export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked");
    }

    // Find the user in the database or create them if they don't exist
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error("Clerk user not found.");
      }
      const email = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      const existingUserByEmail = await db.user.findUnique({
        where: { email },
      });
  
      if (existingUserByEmail) {
        user = await db.user.update({
          where: { id: existingUserByEmail.id },
          data: { clerkUserId: userId },
        });
      } else {
        const name = `${clerkUser.firstName || "User"} ${clerkUser.lastName || ""}`;
  
        user = await db.user.create({
          data: {
            clerkUserId: userId,
            email: email,
            name: name,
          },
        });
      }
    }

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Retrieves essential dashboard data for the current authenticated user.
 * @returns {Promise<object>} An object containing the user's accounts and recent transactions.
 */
export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  // Find the user in the database or create them if they don't exist
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error("Clerk user not found.");
    }
    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      user = await db.user.update({
        where: { id: existingUserByEmail.id },
        data: { clerkUserId: userId },
      });
    } else {
      const name = `${clerkUser.firstName || "User"} ${clerkUser.lastName || ""}`;

      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: email,
          name: name,
        },
      });
    }
  }

  console.log("User found in DB:", user);

  // We can now safely assume `user` exists and proceed with the query
  const userData = await db.user.findUnique({
    where: { id: user.id }, // Use the internal user ID now
    include: {
      accounts: true,
      transactions: {
        orderBy: { date: "desc" },
        take: 10,
      },
    },
  });
  
  // Defensive check: if userData is null, return empty arrays to prevent crashes.
  if (!userData) {
      return {
          accounts: [],
          transactions: []
      }
  }

  // Serialize both accounts and transactions to convert Decimal types
  const serializedAccounts = userData.accounts.map(serializeTransaction);
  const serializedTransactions = userData.transactions.map(serializeTransaction);
  
  return {
    accounts: serializedAccounts,
    transactions: serializedTransactions,
  };
}

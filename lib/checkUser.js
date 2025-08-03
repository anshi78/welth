import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

/**
 * Checks for a logged-in user in the database.
 * If the user does not exist, it creates a new record.
 * @returns {Promise<object | null>} The user object from the database, or null if no user is authenticated.
 */
export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // A user with this Clerk ID was not found, so we create a new one.
    // Use user.fullName for a more robust name, with a fallback.
    const name = user.fullName || `${user.firstName || "User"} ${user.lastName || "Name"}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    // Re-throw the error to ensure the calling function is aware of the failure
    throw new Error("Failed to find or create user.");
  }
};

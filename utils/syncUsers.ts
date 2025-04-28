import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const user = await currentUser();

  if (user) {
    const { id, emailAddresses, firstName, lastName } = user;

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: emailAddresses[0]?.emailAddress || "",
          firstName: firstName || "",
          lastName: lastName || "",
        },
        create: {
          clerkId: id,
          email: emailAddresses[0]?.emailAddress || "",
          firstName: firstName || "",
          lastName: lastName || "",
        },
      });
      console.log("User synced successfully");
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  }
}

import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId,
      },
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: { userId: userId },
        data: { count: userApiLimit.count + 1 },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { userId: userId, count: 1 },
      });
    }
  } catch (error) {
    console.error("Database connection error in increaseApiLimit:", error);
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Database connection error in checkApiLimit:", error);
    return true; // Allow usage when database is unavailable
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  } catch (error) {
    console.error("Database connection error:", error);
    return 0;
  }
};

// import { auth } from "@clerk/nextjs";

// import prismadb from "@/lib/prismadb";
// import { MAX_FREE_COUNTS } from "@/constants";

// export const increaseApiLimit = async () => {
//   const { userId } = auth();

//   if (!userId) {
//     return;
//   }

//   const userApiLimit = await prismadb.userApiLimit.findUnique({
//     where: { userId: userId },
//   });

//   if (userApiLimit) {
//     await prismadb.userApiLimit.update({
//       where: { userId: userId },
//       data: { count: userApiLimit.count + 1 },
//     });
//   } else {
//     await prismadb.userApiLimit.create({
//       data: { userId: userId, count: 1 },
//     });
//   }
// };

// export const checkApiLimit = async () => {
//   const { userId } = auth();

//   if (!userId) {
//     return false;
//   }

//   const userApiLimit = await prismadb.userApiLimit.findUnique({
//     where: { userId: userId },
//   });

//   if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const getApiLimitCount = async () => {
//   const { userId } = auth();

//   if (!userId) {
//     return 0;
//   }

//   const userApiLimit = await prismadb.userApiLimit.findUnique({
//     where: {
//       userId
//     }
//   });

//   if (!userApiLimit) {
//     return 0;
//   }

//   return userApiLimit.count;
// };

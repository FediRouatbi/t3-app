import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100 });
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map((user) => ({
      id: user.id,
      profileImageUrl: user.profileImageUrl,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    }));

    return posts
      .map((post) => ({
        post,
        author: users.find((user) => user.id === post.authorId),
      }))
      .reverse();
  }),
});

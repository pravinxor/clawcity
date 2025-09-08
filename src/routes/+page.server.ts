import { fail } from "@sveltejs/kit";
import { db, pricing, polls, pollOptions, votes, inventory } from "$lib/db.js";
import { eq, sql, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const load = async ({ cookies }) => {
  let userId = cookies.get("userId");
  if (!userId) {
    userId = uuidv4();
    cookies.set("userId", userId, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  const pricingData = await db.select().from(pricing).limit(1);
  const pricingResult = pricingData[0]
    ? {
        prices: JSON.parse(pricingData[0].prices),
        nonMemberPrice: JSON.parse(pricingData[0].nonMemberPrice),
        vipMemberPrice: JSON.parse(pricingData[0].vipMemberPrice),
      }
    : null;

  const pollsData = await db.select().from(polls);
  const allOptions = await db.select().from(pollOptions);
  const userVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.userId, userId));

  const pollsResult = await Promise.all(
    pollsData.map(async (poll) => {
      const pollOptionIds = allOptions
        .filter((option) => option.pollId === poll.id)
        .map((option) => option.id);

      const userVote = userVotes.find((vote) => vote.pollId === poll.id);

      let results: Record<number, number> = {};
      if (userVote) {
        const voteStats = await db
          .select({
            optionId: votes.optionId,
            count: sql<number>`count(*)`,
          })
          .from(votes)
          .where(eq(votes.pollId, poll.id))
          .groupBy(votes.optionId);

        const totalVotes = voteStats.reduce((sum, stat) => sum + stat.count, 0);

        for (const optionId of pollOptionIds) {
          const optionVotes =
            voteStats.find((stat) => stat.optionId === optionId)?.count || 0;
          const percentage =
            totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
          results[optionId] = percentage;
        }
      }

      return {
        ...poll,
        options: allOptions.filter((option) => option.pollId === poll.id),
        userVote: userVote?.optionId,
        results: Object.keys(results).length > 0 ? results : undefined,
      };
    }),
  );

  const inventoryData = await db.select().from(inventory);

  return {
    pricing: pricingResult,
    polls: pollsResult,
    inventory: inventoryData,
    userId,
  };
};

export const actions = {
  vote: async ({ request, cookies }) => {
    const userId = cookies.get("userId")!;
    const data = await request.formData();
    const pollId = parseInt(data.get("pollId") as string, 10);
    const optionId = parseInt(data.get("optionId") as string, 10);

    db.transaction((tx) => {
      tx.delete(votes)
        .where(and(eq(votes.pollId, pollId), eq(votes.userId, userId)))
        .run();
      tx.insert(votes)
        .values({
          pollId,
          optionId,
          userId,
          timestamp: Date.now(),
        })
        .run();
    });

    const voteStats = await db
      .select({
        optionId: votes.optionId,
        count: sql<number>`count(*)`,
      })
      .from(votes)
      .where(eq(votes.pollId, pollId))
      .groupBy(votes.optionId);

    const totalVotes = voteStats.reduce((sum, stat) => sum + stat.count, 0);

    const allOptions = await db
      .select()
      .from(pollOptions)
      .where(eq(pollOptions.pollId, pollId));

    const results: Record<number, number> = {};
    for (const option of allOptions) {
      const optionVotes =
        voteStats.find((stat) => stat.optionId === option.id)?.count || 0;
      const percentage =
        totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
      results[option.id] = percentage;
    }

    return {
      success: true,
      pollId,
      results,
      totalVotes,
      votedOptionId: optionId,
    };
  },
};

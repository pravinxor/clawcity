import { fail } from "@sveltejs/kit";
import { db, pricing, polls, pollOptions, votes, inventory } from "$lib/db.js";
import { eq, sql } from "drizzle-orm";

export const load = async () => {
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

  const voteStats = await db
    .select({
      pollId: votes.pollId,
      optionId: votes.optionId,
      count: sql<number>`count(*)`,
    })
    .from(votes)
    .groupBy(votes.pollId, votes.optionId);

  const pollsResult = pollsData.map((poll) => {
    const pollOptions = allOptions.filter(
      (option) => option.pollId === poll.id,
    );
    const totalVotes = voteStats
      .filter((stat) => stat.pollId === poll.id)
      .reduce((sum, stat) => sum + stat.count, 0);

    const optionsWithStats = pollOptions.map((option) => {
      const optionVotes =
        voteStats.find(
          (stat) => stat.pollId === poll.id && stat.optionId === option.id,
        )?.count || 0;
      const percentage =
        totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

      return {
        ...option,
        voteCount: optionVotes,
        percentage,
      };
    });

    return {
      ...poll,
      options: optionsWithStats,
      totalVotes,
    };
  });

  const inventoryData = await db.select().from(inventory);

  return {
    pricing: pricingResult,
    polls: pollsResult,
    inventory: inventoryData,
  };
};

export const actions = {
  save: async ({ request }) => {
    const data = await request.formData();
    const adminData = data.get("adminData");
    const adminPin = data.get("adminPin");

    if (adminPin !== "1337") return fail(401, { error: "Invalid PIN" });

    const parsed = JSON.parse(adminData as string);

    await db.delete(pricing);
    await db.insert(pricing).values({
      id: 1,
      prices: JSON.stringify(parsed.pricing.prices),
      nonMemberPrice: JSON.stringify(parsed.pricing.nonMemberPrice),
      vipMemberPrice: JSON.stringify(parsed.pricing.vipMemberPrice),
    });

    await db.delete(pollOptions);
    await db.delete(polls);

    for (const poll of parsed.polls) {
      const insertedPoll = await db
        .insert(polls)
        .values({
          title: poll.title,
        })
        .returning({ id: polls.id });

      const actualPollId = insertedPoll[0].id;

      for (const option of poll.options) {
        await db.insert(pollOptions).values({
          pollId: actualPollId,
          text: option.text,
          image: option.image,
        });
      }
    }

    await db.delete(inventory);
    for (const item of parsed.inventory || []) {
      await db.insert(inventory).values({
        title: item.title,
        image: item.image || null,
        inStock: item.inStock,
      });
    }

    return { success: true };
  },
};

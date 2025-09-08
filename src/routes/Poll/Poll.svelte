<script lang="ts">
    import { enhance } from "$app/forms";
    import { browser } from "$app/environment";
    import { X, ChevronRight } from "lucide-svelte";

    type PollOption = {
        id: number;
        text: string;
        image: string | null;
    };

    type Poll = {
        id: number;
        title: string;
        options: PollOption[];
        userVote?: number;
        results?: Record<number, number>;
    };

    let { polls, form }: { polls: Poll[]; form?: any } = $props();

    let votedPolls = $state<Record<number, number>>({});
    let pollResults = $state<Record<number, Record<number, number>>>({});
    let showResults = $state<Record<number, boolean>>({});
    let isSubmitting = $state<Record<number, boolean>>({});

    $effect(() => {
        for (const poll of polls) {
            if (poll.userVote) {
                votedPolls[poll.id] = poll.userVote;
                showResults[poll.id] = true;
                if (poll.results) {
                    pollResults[poll.id] = poll.results;
                }
            }
        }
    });

    $effect(() => {
        if (form?.success && form?.pollId) {
            votedPolls[form.pollId] = form.votedOptionId;
            pollResults[form.pollId] = form.results;
            showResults[form.pollId] = true;
            isSubmitting[form.pollId] = false;
        }
    });

    function revote(pollId: number) {
        delete votedPolls[pollId];
        delete pollResults[pollId];
        showResults[pollId] = false;
        delete isSubmitting[pollId];
    }
</script>

<div class="py-8 bg-gradient-to-b from-pink-50 to-white">
    <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center mb-12">
            <div class="flex-1 h-0.5 bg-claw-blue"></div>
            <h2 class="text-4xl font-bold text-claw-blue mx-8">
                Community Polls
            </h2>
            <div class="flex-1 h-0.5 bg-claw-blue"></div>
        </div>

        <div class="space-y-8">
            {#each polls as poll}
                <div
                    class="bg-white rounded-lg border border-pink-200 overflow-hidden shadow-sm"
                >
                    <div
                        class="bg-claw-yellow/20 px-6 py-4 border-b border-pink-200"
                    >
                        <h3 class="text-xl font-semibold text-gray-800">
                            {poll.title}
                        </h3>
                        {#if showResults[poll.id]}
                            <button
                                onclick={() => revote(poll.id)}
                                class="mt-2 inline-flex items-center text-sm text-claw-red hover:text-claw-red/80 transition-colors"
                            >
                                <X class="w-4 h-4 mr-1" />
                                Change vote
                            </button>
                        {/if}
                    </div>

                    <div class="p-6">
                        <div class="space-y-3">
                            {#each poll.options as option}
                                {@const isSelected =
                                    votedPolls[poll.id] === option.id}
                                {@const percentage =
                                    pollResults[poll.id]?.[option.id] || 0}

                                <div class="relative">
                                    {#if showResults[poll.id]}
                                        <div
                                            class="flex items-center justify-between p-4 rounded-lg border-2 {isSelected
                                                ? 'border-claw-red bg-claw-red/5'
                                                : 'border-gray-200 bg-gray-50'}"
                                        >
                                            <div
                                                class="flex items-center space-x-4 flex-1"
                                            >
                                                {#if option.image}
                                                    <img
                                                        src={option.image}
                                                        alt={option.text}
                                                        class="w-12 h-12 object-cover rounded-lg"
                                                        onerror={(e) =>
                                                            ((
                                                                e.target as HTMLElement
                                                            ).style.display =
                                                                "none")}
                                                    />
                                                {/if}
                                                <span
                                                    class="text-gray-800 {isSelected
                                                        ? 'font-semibold'
                                                        : ''}"
                                                    >{option.text}</span
                                                >
                                                {#if isSelected}
                                                    <span
                                                        class="text-claw-red text-sm font-medium"
                                                        >✓ Your vote</span
                                                    >
                                                {/if}
                                            </div>
                                            <div
                                                class="flex items-center space-x-2"
                                            >
                                                <span
                                                    class="text-lg font-bold text-gray-700"
                                                    >{percentage}%</span
                                                >
                                            </div>
                                        </div>

                                        <div
                                            class="mt-2 w-full bg-gray-200 rounded-full h-2"
                                        >
                                            <div
                                                class="bg-claw-blue rounded-full h-2 transition-all duration-500"
                                                style="width: {percentage}%"
                                            ></div>
                                        </div>
                                    {:else}
                                        <form
                                            method="POST"
                                            action="?/vote"
                                            use:enhance={() => {
                                                isSubmitting[poll.id] = true;
                                                return async ({ update }) => {
                                                    await update();
                                                };
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="pollId"
                                                value={poll.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="optionId"
                                                value={option.id}
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmitting[poll.id]}
                                                class="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-claw-blue hover:bg-claw-blue/5 transition-all duration-200 disabled:opacity-50"
                                            >
                                                <div
                                                    class="flex items-center space-x-4"
                                                >
                                                    {#if option.image}
                                                        <img
                                                            src={option.image}
                                                            alt={option.text}
                                                            class="w-12 h-12 object-cover rounded-lg"
                                                            onerror={(e) =>
                                                                ((
                                                                    e.target as HTMLElement
                                                                ).style.display =
                                                                    "none")}
                                                        />
                                                    {/if}
                                                    <span class="text-gray-800"
                                                        >{option.text}</span
                                                    >
                                                </div>
                                                <ChevronRight
                                                    class="w-5 h-5 text-gray-400"
                                                />
                                            </button>
                                        </form>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

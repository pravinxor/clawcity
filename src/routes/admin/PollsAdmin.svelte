<script lang="ts">
    type PollOption = {
        id: number;
        text: string;
        image: string | null;
        voteCount?: number;
        percentage?: number;
    };

    type Poll = {
        id: number;
        title: string;
        options: PollOption[];
        totalVotes?: number;
    };

    let { polls = $bindable() } = $props<{ polls: Poll[] }>();

    function addPoll() {
        const maxId =
            polls.length > 0 ? Math.max(...polls.map((p: Poll) => p.id)) : 0;
        const newId = maxId + 1;
        polls.push({
            id: newId,
            title: "New Poll",
            options: [
                { id: newId * 10 + 1, text: "Option 1", image: null },
                { id: newId * 10 + 2, text: "Option 2", image: null },
            ],
        });
    }

    function removePoll(index: number) {
        polls.splice(index, 1);
    }

    function addOption(pollIndex: number) {
        const poll = polls[pollIndex];
        const maxId =
            poll.options.length > 0
                ? Math.max(...poll.options.map((o: PollOption) => o.id))
                : 0;
        const newId = maxId + 1;
        poll.options.push({
            id: newId,
            text: "New Option",
            image: null,
        });
    }

    function removeOption(pollIndex: number, optionIndex: number) {
        polls[pollIndex].options.splice(optionIndex, 1);
    }
</script>

<div class="bg-white border rounded p-6">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Polls Management</h2>
        <button
            onclick={addPoll}
            type="button"
            class="bg-green-500 text-white px-3 py-1 rounded"
        >
            Add Poll
        </button>
    </div>

    <div class="space-y-6">
        {#each polls as poll, pollIndex}
            <div class="border rounded p-4">
                <div class="flex justify-between items-end mb-4">
                    <div class="flex-1 mr-4">
                        <label
                            for="poll-title-{pollIndex}"
                            class="block text-sm font-medium mb-1"
                            >Poll Title:</label
                        >
                        <input
                            bind:value={poll.title}
                            id="poll-title-{pollIndex}"
                            class="w-full border rounded p-2"
                            type="text"
                        />
                    </div>
                    <button
                        onclick={() => removePoll(pollIndex)}
                        type="button"
                        class="bg-red-500 text-white px-3 py-2 rounded"
                    >
                        Remove Poll
                    </button>
                </div>

                {#if poll.totalVotes && poll.totalVotes > 0}
                    <div class="bg-gray-100 p-3 rounded mb-4">
                        <h4 class="font-medium mb-2">
                            Current Vote Stats (Total: {poll.totalVotes} votes):
                        </h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            {#each poll.options as option}
                                <div>
                                    {option.text}:
                                    <strong>{option.percentage || 0}%</strong>
                                    <span class="text-gray-500"
                                        >({option.voteCount || 0} votes)</span
                                    >
                                </div>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <div class="bg-yellow-100 p-3 rounded mb-4">
                        <p class="text-sm text-yellow-700">
                            No votes yet for this poll
                        </p>
                    </div>
                {/if}

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <h4 class="font-medium">Options:</h4>
                        <button
                            onclick={() => addOption(pollIndex)}
                            type="button"
                            class="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                            Add Option
                        </button>
                    </div>

                    {#each poll.options as option, optionIndex}
                        <div class="flex gap-2 items-center border rounded p-2">
                            <div class="flex-1">
                                <input
                                    bind:value={option.text}
                                    class="w-full border rounded p-1"
                                    placeholder="Option text"
                                    type="text"
                                />
                            </div>
                            <div class="w-48">
                                <input
                                    bind:value={option.image}
                                    class="w-full border rounded p-1"
                                    placeholder="Image URL (optional)"
                                    type="text"
                                />
                            </div>
                            <button
                                onclick={() =>
                                    removeOption(pollIndex, optionIndex)}
                                type="button"
                                class="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

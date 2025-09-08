<script lang="ts">
    import { enhance } from "$app/forms";
    import PricingAdmin from "./PricingAdmin.svelte";
    import PollsAdmin from "./PollsAdmin.svelte";
    import InventoryAdmin from "./InventoryAdmin.svelte";

    let { data, form } = $props();

    let pricing = $state(
        data.pricing || {
            prices: [],
            nonMemberPrice: [],
            vipMemberPrice: [],
        },
    );
    let polls = $state(data.polls);
    let inventory = $state(data.inventory || []);
    let isSubmitting = $state(false);
    let isSaved = $state(false);
    let adminPin = $state("");
</script>

<div class="container mx-auto p-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-8">Admin Panel</h1>

    {#if isSaved}
        <div class="text-center py-16">
            <h2 class="text-3xl font-bold text-green-600 mb-4">
                Saved Successfully!
            </h2>
            <button
                onclick={() => (isSaved = false)}
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
                Edit Again
            </button>
        </div>
    {:else}
        {#if form?.error}
            <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            >
                Error: {form.error}
            </div>
        {/if}

        <form
            method="POST"
            action="?/save"
            use:enhance={() => {
                isSubmitting = true;
                return async ({ result, update }) => {
                    if (result.type === "success") {
                        isSubmitting = false;
                        isSaved = true;
                        adminPin = "";
                    } else {
                        await update();
                        isSubmitting = false;
                    }
                };
            }}
        >
            <div class="space-y-8">
                <PricingAdmin bind:pricing />
                <InventoryAdmin bind:inventory />
                <PollsAdmin bind:polls />
            </div>

            <input
                type="hidden"
                name="adminData"
                value={JSON.stringify({ pricing, inventory, polls })}
            />

            <input type="hidden" name="adminPin" value={adminPin} />

            <div class="mt-8 flex items-end justify-center gap-3">
                <div class="flex flex-col">
                    <label for="pin" class="text-sm text-gray-600 mb-1"
                        >Admin PIN:</label
                    >
                    <input
                        id="pin"
                        type="password"
                        bind:value={adminPin}
                        placeholder="Enter 4-digit PIN"
                        maxlength="4"
                        class="px-3 py-2 border border-gray-300 rounded-md text-center tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || adminPin.length !== 4}
                    class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Saving..." : "Save All Changes"}
                </button>
            </div>
        </form>
    {/if}
</div>

<script lang="ts">
    import { ImageOff } from "lucide-svelte";

    export let inventory: Array<{
        id: number;
        title: string;
        image?: string | null;
        inStock: boolean;
    }>;
</script>

<div class="py-8">
    <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center mb-12">
            <div class="flex-1 h-0.5 bg-claw-red"></div>
            <h2 class="text-4xl font-bold text-claw-red mx-8">Inventory</h2>
            <div class="flex-1 h-0.5 bg-claw-red"></div>
        </div>

        <div class="bg-white overflow-hidden rounded-lg border border-pink-200">
            <table class="w-full">
                <thead class="bg-claw-blue">
                    <tr>
                        <th class="px-6 py-4 text-center font-medium">Image</th>
                        <th class="px-6 py-4 text-center font-medium">Item</th>
                        <th class="px-6 py-4 text-center font-medium">Status</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each inventory as item}
                        <tr class="border-b border-pink-100">
                            <td class="px-6 py-4 text-center">
                                {#if item.image}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        class="w-12 h-12 object-cover rounded mx-auto"
                                    />
                                {:else}
                                    <div
                                        class="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center"
                                    >
                                        <ImageOff
                                            class="w-6 h-6 text-gray-400"
                                        />
                                    </div>
                                {/if}
                            </td>
                            <td
                                class="px-6 py-4 font-medium text-gray-800 text-center"
                            >
                                {item.title}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span
                                    class="inline-flex px-3 py-1 text-sm font-medium {item.inStock
                                        ? 'text-green-500'
                                        : 'text-red-500'}"
                                >
                                    {item.inStock ? "In Stock" : "Out of Stock"}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            {#if inventory.length === 0}
                <div class="px-6 py-8 text-center text-gray-500">
                    No inventory items configured yet.
                </div>
            {/if}
        </div>
    </div>
</div>

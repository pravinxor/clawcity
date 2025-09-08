<script lang="ts">
    let { inventory = $bindable() } = $props<{
        inventory: Array<{
            id?: number;
            title: string;
            image?: string | null;
            inStock: boolean;
        }>;
    }>();

    function addInventoryItem() {
        inventory = [
            ...inventory,
            {
                title: "",
                image: "",
                inStock: true,
            },
        ];
    }

    function removeItem(index: number) {
        inventory = inventory.filter((_: any, i: number) => i !== index);
    }
</script>

<div class="bg-white border rounded p-6">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Inventory Management</h2>
        <button
            onclick={addInventoryItem}
            type="button"
            class="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
            Add Item
        </button>
    </div>

    <table class="w-full border-collapse border">
        <thead>
            <tr class="bg-gray-100">
                <th class="border p-2">Item Title</th>
                <th class="border p-2">Image URL</th>
                <th class="border p-2">In Stock</th>
                <th class="border p-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each inventory as item, index}
                <tr>
                    <td class="border p-2">
                        <input
                            bind:value={item.title}
                            class="w-full border rounded p-1"
                            type="text"
                            placeholder="Enter item title"
                        />
                    </td>
                    <td class="border p-2">
                        <input
                            bind:value={item.image}
                            class="w-full border rounded p-1"
                            type="text"
                            placeholder="Enter image URL (optional)"
                        />
                    </td>
                    <td class="border p-2 text-center">
                        <input
                            bind:checked={item.inStock}
                            type="checkbox"
                            class="w-4 h-4"
                        />
                    </td>
                    <td class="border p-2 text-center">
                        <button
                            onclick={() => removeItem(index)}
                            type="button"
                            class="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if inventory.length === 0}
        <div class="text-center py-8 text-gray-500">
            No inventory items yet. Click "Add Item" to get started.
        </div>
    {/if}
</div>

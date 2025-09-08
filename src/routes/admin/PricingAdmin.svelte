<script lang="ts">
    let { pricing = $bindable() } = $props<{
        pricing: {
            prices: string[];
            nonMemberPrice: string[];
            vipMemberPrice: string[];
        };
    }>();

    function addPriceRow() {
        pricing.prices = [...pricing.prices, "$"];
        pricing.nonMemberPrice = [...pricing.nonMemberPrice, ""];
        pricing.vipMemberPrice = [...pricing.vipMemberPrice, ""];
    }

    function removeRow(index: number) {
        pricing.prices = pricing.prices.filter(
            (_: string, i: number) => i !== index,
        );
        pricing.nonMemberPrice = pricing.nonMemberPrice.filter(
            (_: string, i: number) => i !== index,
        );
        pricing.vipMemberPrice = pricing.vipMemberPrice.filter(
            (_: string, i: number) => i !== index,
        );
    }
</script>

<div class="bg-white border rounded p-6">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Pricing Management</h2>
        <button
            onclick={addPriceRow}
            type="button"
            class="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
            Add Row
        </button>
    </div>

    <table class="w-full border-collapse border">
        <thead>
            <tr class="bg-gray-100">
                <th class="border p-2">Price</th>
                <th class="border p-2">Non-Member</th>
                <th class="border p-2">VIP Member</th>
                <th class="border p-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each pricing.prices as price, index}
                <tr>
                    <td class="border p-2">
                        <input
                            bind:value={pricing.prices[index]}
                            class="w-full border rounded p-1"
                            type="text"
                        />
                    </td>
                    <td class="border p-2">
                        <input
                            bind:value={pricing.nonMemberPrice[index]}
                            class="w-full border rounded p-1"
                            type="text"
                        />
                    </td>
                    <td class="border p-2">
                        <input
                            bind:value={pricing.vipMemberPrice[index]}
                            class="w-full border rounded p-1"
                            type="text"
                        />
                    </td>
                    <td class="border p-2 text-center">
                        <button
                            onclick={() => removeRow(index)}
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
</div>

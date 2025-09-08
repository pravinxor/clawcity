<script lang="ts">
    export let pricing: {
        prices: string[];
        nonMemberPrice: string[];
        vipMemberPrice: string[];
    };
</script>

<div class="py-8">
    <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center mb-12">
            <div class="flex-1 h-0.5 bg-claw-red"></div>
            <h2 class="text-4xl font-bold text-claw-red mx-8">Pricing</h2>
            <div class="flex-1 h-0.5 bg-claw-red"></div>
        </div>

        <div class="bg-white overflow-hidden rounded-lg border border-pink-200">
            <table class="w-full">
                <thead class="bg-claw-blue">
                    <tr>
                        <th class="px-6 py-4 text-center font-medium">Prices</th
                        >
                        <th class="px-6 py-4 text-center font-medium"
                            >Non-Member</th
                        >
                        <th class="px-6 py-4 text-center font-medium"
                            >VIP-Member</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each pricing.prices as price, index}
                        <tr class="border-b border-pink-100">
                            <td
                                class="px-6 py-4 font-medium text-gray-800 text-center"
                                >{price}</td
                            >
                            <td class="px-6 py-4 text-gray-700 text-center"
                                >{pricing.nonMemberPrice[index]}</td
                            >
                            <td
                                class="px-6 py-4 text-claw-red font-medium text-center"
                                >{pricing.vipMemberPrice[index]}</td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

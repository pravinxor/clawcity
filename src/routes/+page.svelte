<script>
    import Title from "./Title";
    import Pricing from "./Pricing";
    import Poll from "./Poll";
    import Inventory from "./Inventory/Inventory.svelte";

    let { data, form } = $props();
</script>

<div class="h-[30vh]">
    <Title />
</div>

{#if data.pricing}
    <Pricing pricing={data.pricing} />
{/if}

{#if data.inventory && data.inventory.length > 0}
    <Inventory inventory={data.inventory} />
{/if}

<Poll polls={data.polls} {form} />

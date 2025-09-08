<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    import Navbar from "./Navbar";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="bg-pink-50 min-h-screen text-gray-800">
    <Navbar />
    {@render children?.()}
</div>

<script lang="ts">
    import { X } from "lucide-svelte";

    let {
        title,
        open = $bindable(false),
        children,
    }: {
        title: string;
        open: boolean;
        children?: any;
    } = $props();

    let dialog: HTMLDialogElement;

    $effect(() => {
        if (open) dialog?.showModal();
        else dialog?.close();
    });
</script>

<dialog
    bind:this={dialog}
    onclick={(e) => {
        if (e.target === dialog) open = false;
    }}
    class="backdrop:bg-black/50 backdrop:backdrop-blur-md w-full m-auto bg-white border border-pink-500 p-8 rounded-lg"
>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-medium text-claw-red">
            {title}
        </h2>
        <button
            onclick={() => (open = false)}
            class="text-gray-500 hover:text-claw-red transition-colors p-1 rounded hover:bg-pink-50"
        >
            <X size={24} />
        </button>
    </div>
    <div class="text-gray-700 leading-relaxed">
        {@render children?.()}
    </div>
</dialog>

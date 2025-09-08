<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";

    const images = ["image1.png", "image2.png", "image3.webp"].map(
        (image) => `/slideshow/${image}`,
    );

    let showHowItWorks = $state(false);
    let showContact = $state(false);
    let showAbout = $state(false);

    let currentIndex = $state(0);
    let intervalId: number | undefined;
    function startTimer() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(
            () => (currentIndex = (currentIndex + 1) % images.length),
            5000,
        ) as unknown as number;
    }
    startTimer();
</script>

<div class="title-container relative h-full p-6">
    <div
        class="absolute inset-6 z-0 overflow-hidden rounded-2xl bg-pink-50 border-4 border-white"
    >
        <div
            class="flex transition-transform duration-500 ease-in-out h-full"
            style="transform: translateX(-{currentIndex * 100}%)"
        >
            {#each images as image, index}
                <img
                    src={image}
                    alt="Slideshow image {index}"
                    class="slide w-full h-full object-cover flex-shrink-0 rounded-2xl"
                />
            {/each}
        </div>
        <div class="absolute inset-0 bg-black/40"></div>
    </div>
    <div
        class="absolute inset-6 z-10 flex flex-col items-center justify-center"
    >
        <img
            src="/logotext.png"
            alt="Claw City"
            class="max-w-lg w-full h-auto mb-8 brightness-0 invert"
        />

        <div class="flex space-x-4">
            <button
                onclick={() => (showHowItWorks = true)}
                class="bg-claw-yellow hover:bg-claw-yellow/90 px-8 py-4 rounded-lg border border-claw-yellow/70 transition-colors text-lg font-medium"
            >
                How it works
            </button>
            <button
                onclick={() => (showAbout = true)}
                class="bg-claw-red hover:bg-claw-red/90 px-8 py-4 rounded-lg border border-claw-red/70 transition-colors text-lg font-medium"
            >
                About us
            </button>
            <button
                onclick={() => (showContact = true)}
                class="bg-claw-blue hover:bg-claw-blue/90 px-8 py-4 rounded-lg border border-claw-blue/70 transition-colors text-lg font-medium"
            >
                Contact/Hours
            </button>
        </div>
    </div>

    <div
        class="flex space-x-3 absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
    >
        {#each images as _, index}
            <button
                class="w-3 h-3 rounded-full {index === currentIndex
                    ? 'bg-claw-red'
                    : 'bg-white/60'} hover:bg-claw-red transition-colors border border-pink-200"
                onclick={() => {
                    currentIndex = index;
                    startTimer();
                }}
                aria-label="Go to slide {index + 1}"
            ></button>
        {/each}
    </div>
</div>

<Modal title="How it works" bind:open={showHowItWorks}>
    <p>
        We have claw machiens and you can trade in dolls for prizes when you win
    </p>
</Modal>

<Modal title="About us" bind:open={showAbout}>
    <div>
        <p>Welcome to Claw City!</p>
        <p class="mt-2">We are claw machine center based in North texas</p>
        <p class="mt-2">
            Whether you're new or a seasoned expert, we are sure you will have
            fun here!
        </p>
    </div>
</Modal>

<Modal title="Contact/Hours" bind:open={showContact}>
    <div>
        <p>Get in touch with us!</p>
        <ul class="mt-2 space-y-1">
            <li><strong>Email:</strong> contact@clawcity.com</li>
            <li><strong>Phone:</strong> (555) 123-4567</li>
        </ul>
    </div>
</Modal>

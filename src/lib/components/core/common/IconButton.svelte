<script>
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import { scale } from "svelte/transition";

let {
    selected = $bindable(),
    persistent = false,
    icon = "",
    successIcon = "lucide:check",
    awaitIcon = "line-md:loading-twotone-loop",
    failIcon = "",
    onclick = () => {},
    width = 16,
    ...props
} = $props();

let clicked = $state(false);
let container = $state(null);
let timeoutId = $state(null);
let iconElement = $state(null);
let isAwaiting = $state(false);

let iconsWidth = $derived.by(() => {
    if (typeof width == "number" || typeof width == "string") {
        return {
            base: width,
            success: width,
            await: width,
            failIcon: width,
        };
    }
    if (typeof width == "object") {
        return {
            base: width.base || 16,
            success: width.success || 16,
            await: width.await || 16,
            failIcon: width.failIcon || 16,
        };
    }
});

onMount(() => {
    const parent = container.parentElement;
    parent.addEventListener("click", async (e) => {
        if (onclick) {
            clicked = null;
            isAwaiting = true;
            await onclick();
            isAwaiting = false;
        }
        handleButtonClick(e);
    });
});

async function handleButtonClick() {
    if (clicked) {
        clearTimeout(timeoutId); // Clear the previous timeout if it exists
    }
    if (persistent) {
        await persistentClick();
    } else {
        await normalClick();
    }
}

async function normalClick() {
    clicked = true;

    timeoutId = setTimeout(() => {
        clicked = false;
    }, 1000);
}

async function persistentClick() {
    clicked = !clicked; // Toggle clicked state
}
$effect(() => {
    selected;
    if (persistent) {
        clicked = selected ?? false;
    }
});
</script>

<div class="container" bind:this={container} style={`--width: ${width}px;`}>
    <div class="icons" bind:this={iconElement}>
        {#if clicked == false}
            <div class="icon" class:hide={clicked == true} transition:scale>
                <Icon {icon} width={iconsWidth.base} {...props} />
            </div>
        {/if}

        {#if isAwaiting}
            <div class="icon" class:hide={isAwaiting} transition:scale>
                <Icon icon={awaitIcon} width={iconsWidth.await} {...props} />
            </div>
        {/if}

        {#if clicked == true}
            <div class="icon" class:hide={clicked == false} transition:scale>
                <Icon icon={successIcon} width={iconsWidth.success} {...props} />
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
.container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--width);
    height: var(--width);

    .icons {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        pointer-events: none;
        .icon {
            position: absolute;
            color: inherit;
        }
    }
}
</style>

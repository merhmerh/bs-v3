<script>
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import { slide } from "svelte/transition";
import { getToastState } from "./ToastState.svelte.js";
import { linear } from "svelte/easing";

const ts = getToastState();
let { position = "center", small = false } = $props();
onMount(() => {});

const icons = {
    success: {
        icon: "material-symbols:check-circle-outline-rounded",
        color: "var(--green)",
    },
    error: {
        icon: "material-symbols:error-outline-rounded",
        color: "var(--red)",
    },
    alert: { icon: "lucide:octagon-alert", color: "var(--orange)" },
    warning: { icon: "tabler:alert-triangle", color: "PaleVioletRed" },
    info: { icon: "material-symbols:info-outline-rounded", color: "var(--mono)" },
};
</script>

<div class="toaster {position}" class:small>
    {#each ts.toasts as toast (toast.id)}
        <div
            class="toast-container"
            in:slide={{ axis: "y", easing: linear, duration: 200 }}
            out:slide={{ axis: "y", easing: linear, duration: 200 }}>
            <div class="toast" style="--c:{icons[toast.type].color} ">
                <div class="status icon">
                    <Icon icon={icons[toast.type].icon} width={small ? 24 : 24} />
                </div>
                <div class="text">
                    <div class="title">
                        {toast.title}
                    </div>
                    <div class="message">
                        {toast.message}
                    </div>
                </div>
                <button
                    class="close icon none"
                    onclick={() => {
                        ts.remove(toast.id);
                    }}>
                    <Icon icon="lucide:x" width={small ? 16 : 24} />
                </button>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
.toaster {
    z-index: 1000;
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    // gap: 0.5rem;
    width: max-content;
    top: 1rem;
    transform: translateZ(0);
    &.center {
        left: 50%;
        transform: translateX(-50%);
    }
    &.right {
        right: 1rem;
    }
    &.small {
        top: 0.5rem;
        .toast-container {
            margin-block: 0.25rem;
            min-height: 3rem;
            border-radius: 0.5rem;
        }
        .toast {
            padding-block: 0.375rem;
            padding-inline: 0.5rem;
            border: 1px solid var(--border-primary);
            background-color: color-mix(in srgb, var(--bg-100), 20% var(--mono));
            box-shadow: 0px 2px 8px 0px color-mix(in srgb, var(--bx-c) 9%, transparent);
            gap: 0.375rem;
            button.close {
                margin: 0 !important;
            }
            .text {
                .title {
                    display: none;
                }
            }
        }
    }
    .toast {
        background-color: #fff;
        border: 1px solid #000;
        padding-block: 1rem;
        padding-inline: 1rem;
        padding-right: 0rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        border: 2px solid var(--c);
        background-color: color-mix(in srgb, var(--c), 85% var(--bg-100));
        gap: 0.5rem;
        max-width: 400px;
        .status {
            color: var(--c);
        }
        .text {
            min-width: 150px;
            .title {
                font-size: 1rem;
            }
            .message {
                font-size: 0.875rem;
                color: var(--text);
                white-space: pre-wrap;
            }
        }
        button.close {
            color: var(--text-soft);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-inline: 0.5rem;
            margin-left: auto;
        }
    }
}
</style>

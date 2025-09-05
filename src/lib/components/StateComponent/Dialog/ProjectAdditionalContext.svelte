<script>
import Icon from "@iconify/svelte";
let { contexts } = $props();
let ctx = $state($state.snapshot(contexts));

let ctxOpen = $state(null);

export function getContext() {
    return $state.snapshot(ctx);
}
</script>

<div class="label-box">
    <p>Additional Context</p>
    <div class="ctx">
        {#each ctx as { id, context }}
            <div class="row">
                <button
                    class="text"
                    onclick={() => {
                        if (ctxOpen === id) {
                            ctxOpen = null;
                        } else {
                            ctxOpen = id;
                        }
                    }}
                    class:open={ctxOpen === id}>
                    <p>{context.replace(/\.\s/g, "\.\n\n")}</p>
                    <div class="icon no-hover">
                        <Icon icon="ic:round-expand-more" width="20" vFlip={ctxOpen == id} />
                    </div>
                </button>
                <button
                    class="icon warning"
                    onclick={() => {
                        ctx = ctx.filter((c) => c.id !== id);
                        ctxOpen = null;
                    }}>
                    <Icon icon="lucide:x" />
                </button>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
.label-box {
    .ctx {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            gap: 0.25rem;
            border: 1px solid var(--border);
            padding: 0.25rem;
            border-radius: 0.375rem;
            button.text {
                border-radius: 0.25rem;
                width: calc(100% - 1.75rem);
                display: flex;
                gap: 0.25rem;
                padding: 0.25rem;
                border: 0;
                gap: 0.5rem;
                transition: background-color 0.15s;
                &:hover {
                    background-color: var(--bg-200);
                }
                p {
                    margin-top: 0.125rem;
                    width: 100%;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                &.open {
                    background-color: var(--bg-200);
                    p {
                        white-space: pre-wrap;
                        text-align: left;
                        line-height: normal;
                    }
                }
                .icon {
                    height: fit-content;
                }
            }
            button.icon {
                margin-top: 0.125rem;
            }
        }
    }
}
</style>

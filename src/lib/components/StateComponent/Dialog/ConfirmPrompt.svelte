<script>
let { name, message = null } = $props();

export function set({ name: newName, message: newMessage }) {
    if (newName) name = newName;
    if (newMessage) message = newMessage;
}
</script>

<div class="container">
    {#if message}
        {#if typeof message === "string"}
            <p>{message}</p>
        {:else if typeof message === "object"}
            {#each message as msg}
                <p>{msg}</p>
            {/each}
        {/if}
    {:else}
        <p>
            Are you sure you want to delete
            {#if name}
                <strong>"{name}"</strong>
            {/if}?
        </p>
        <p>This action is irreversible.</p>
    {/if}
</div>

<style lang="scss">
.container {
    padding-block: 0.25rem;
    padding-left: 0.5rem;
    border-left: 4px solid var(--red);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    p {
        color: var(--text);
        font-size: 0.875rem;
        white-space: pre-wrap;
        margin: 0;
        line-height: 150%;
        strong {
            white-space: normal;
        }
    }
}
</style>

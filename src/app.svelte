<script lang="ts">
    import Workflow from './workflow.svelte'
    import {config} from "./config";
</script>

<main class="px-8 py-12">
    <div class="grid grid-cols-4 gap-12">
        {#each config.projects as project}
            <Workflow {project} token={config.token} />
        {/each}
    </div>
</main>
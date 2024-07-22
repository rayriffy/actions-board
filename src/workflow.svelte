<script lang="ts">
    import { Octokit } from '@octokit/rest'
    import {onMount} from "svelte";
    import {clsx} from "clsx";

    import RelativeTime from "./relativeTime.svelte"

    import type {Project} from "./types";

    export let project: Project
    export let token: string

    interface Workflows {
        id: number
        status: 'success' | 'fail' | 'pend'
        updatedAt: string
    }

    let polled = false
    let workflows: Workflows[] = []
    let lastUpdated: string = new Date().toISOString()

    const octokit = new Octokit({
        auth: token
    });

    const poll = async () => {
        const data = await octokit.rest.actions.listWorkflowRunsForRepo({
            owner: project.owner,
            repo: project.repo,
            per_page: 3,
            // prevent cached requests
            headers: {
                'If-None-Match': ''
            }
        })

        workflows = data.data.workflow_runs.map(workflow => ({
            id: workflow.id,
            status: workflow.status === 'completed' ? 'success' : ['cancelled', 'failure', 'timed_out'].includes(workflow.status ?? '') ? 'fail' : 'pend',
            updatedAt: workflow.updated_at
        }))
        lastUpdated = new Date().toISOString()
        polled = true
    }

    onMount(() => {
        let interval = setInterval(poll, 1500)
        return () => {
            clearInterval(interval)
        }
    })
</script>

<section class="space-y-1">
    <div class="flex items-center justify-between">
        <h2 class="text-gray-600 font-semibold text-xl">{project.name}</h2>
        <p><RelativeTime timestamp={lastUpdated} /></p>
    </div>
    <div class="flex space-x-4 items-center">
        <span class="flex relative h-3 w-3">
          <span class={clsx(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              workflows?.[0]?.status === 'success' ? 'bg-green-400' : workflows?.[0]?.status === 'fail' ? 'bg-red-400' : 'bg-yellow-400'
          )}></span>
          <span class={clsx("relative inline-flex rounded-full h-3 w-3",
              workflows?.[0]?.status === 'success' ? 'bg-green-500' : workflows?.[0]?.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'
          )}></span>
        </span>
        <h1 class="font-bold text-4xl capitalize">
            {#if polled}
                {#if workflows?.[0]?.status === 'success'}
                    Success
                {:else if workflows?.[0]?.status === 'fail'}
                    Failure
                {:else}
                    Deploying
                {/if}
            {:else}
                Checking
            {/if}
        </h1>
    </div>
    <h3 class="font-medium text-xl">Pipelines</h3>
    {#each workflows as workflow, i (workflow.id + i + workflow.updatedAt)}
        <div class="flex justify-between text-sm">
            <p class="font-semibold">
                {#if workflow.status === 'success'}
                    ✅
                {:else if workflow.status === 'fail'}
                    💥
                {:else}
                    🕑
                {/if}
                {' '}#{workflow.id}
            </p>
            <p>
                <RelativeTime timestamp={workflow.updatedAt} />
            </p>
        </div>
    {/each}
</section>
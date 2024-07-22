<script lang="ts">
    import { onMount } from "svelte";
    import type {Timepart} from "./types";

    export let timestamp: string

    let diffInSeconds: number = 0

    onMount(() => {
        let interval = setInterval(() => {
            const now = new Date()
            const then = new Date(timestamp)
            diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)
        })

        return () => clearInterval(interval)
    })

    const calculateTimeParts = (totalSeconds: number): Timepart => {
        const months = Math.floor(totalSeconds / (3600 * 24 * 30));
        totalSeconds %= 3600 * 24 * 30;
        const days = Math.floor(totalSeconds / (3600 * 24));
        totalSeconds %= 3600 * 24;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return { months, days, hours, minutes, seconds };
    };

    const formatRelativeTime = ({ months, days, hours, minutes, seconds }: Timepart) => {
        let result = '';
        if (months > 0) result += `${months}m`;
        if (days > 0) result += `${days}d`;
        if (hours > 0) result += `${hours}h`;
        if (minutes > 0) result += `${minutes}m`;
        result += `${seconds}s`;

        return result;
    };
</script>

{formatRelativeTime(calculateTimeParts(diffInSeconds))}

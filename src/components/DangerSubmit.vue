<script>
    export default {
        name: 'DangerSubmit',
        props: {
            inactive: false
        }
    }
</script>

<template>
    <button class="mt-3 p-2 px-4 text-white font-medium rounded bg-red-400 hover:bg-red-500 hover:transition-all disabled:bg-red-200" type="submit" :disabled="inactive"><font-awesome-icon icon="trash" /> <slot /></button>
</template>
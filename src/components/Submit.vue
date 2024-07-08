<script>
    export default {
        name: 'Submit',
        props: {
            inactive: false
        }
    }
</script>

<template>
    <button class="mt-3 p-2 px-4 font-medium rounded bg-indigo-500 hover:bg-indigo-600 hover:transition-all disabled:bg-indigo-300 disabled:cursor-not-allowed text-white" type="submit" :disabled="inactive"><slot /></button>
</template>
<script>
    export default {
        name: 'GenericButton',
        props: {
            bg: "",
            text: ""
        }
    }
</script>

<template>
    <button :class="'mt-3 p-2 px-4 font-medium rounded hover:transition-all text-white transition-all hover:opacity-80 ' + bg + ' ' + text" type="button"><slot /></button>
</template>
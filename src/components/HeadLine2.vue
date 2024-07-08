<script>
    export default {
        name: 'HeadLine2',
        props: {
            styles: String
        }
    }
</script>

<template>
    <h2 :class="`overflow-hidden text-2xl mb-10 pb-2 border-b-2 border-gray-100 ${styles ? styles : ''}`"><slot /></h2>
</template>

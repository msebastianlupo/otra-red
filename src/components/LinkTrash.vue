<script>
    export default {
        name: 'LinkTrash',
        props: {
            to: "/"
        }
    }
</script>

<template>
    <router-link :to="to" class="py-1 px-2 rounded ml-2 hover:bg-red-300"><font-awesome-icon icon="trash" /></router-link>
</template>
<script>
    export default {
        name: 'LinkEye',
        props: {
            to: "/"
        }
    }
</script>

<template>
    <router-link :to="to" class="py-1 px-2 rounded ml-2 hover:bg-indigo-300"><font-awesome-icon icon="eye" /></router-link>
</template>
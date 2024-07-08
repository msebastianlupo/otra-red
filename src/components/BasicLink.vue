<script>
    export default {
        name: 'BasicLink',
        props: {
            to: "/",
            title: ""
        }
    }
</script>

<template>
    <router-link :to="to" class="hover:text-indigo-600" :title="title"><slot /></router-link>
</template>
<script>
    export default {
        name: 'Link',
        props: {
            text: "",
            to: "/"
        }
    }
</script>

<template>
    <router-link class="p-1 px-4 rounded bg-indigo-400 hover:bg-indigo-500 transition-all font-medium text-white" :to="to">{{text}}</router-link>
</template>
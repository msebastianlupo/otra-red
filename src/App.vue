<script>
    import HeadLine from './components/HeadLine.vue'
    import NavigationBar from './components/NavigationBar.vue'
    export default {
        name: 'App',
        components: {HeadLine, NavigationBar}
    }
</script>
<template>
    <header class="mt-14 sm:mt-16 bg-indigo-50"><HeadLine>{{$route.meta.title}}</HeadLine></header>
    <NavigationBar />
    <main class="max-w-5xl p-4 xl:px-0 mt-5 mx-auto min-h-screen text-gray-700">
        <router-view />
    </main>
    <footer class="p-3 text-center font-medium border-spacing-y-1 text-indigo-600">&copy; 2024 - Otra Red</footer>
</template>
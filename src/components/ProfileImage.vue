<script>
    export default {
        name: 'ProfileImage',
        props: {
            image: {
                type: String,
                default: null
            },
            styles: {
                type: String,
                default: null
            }
            
        }
    }
</script>

<template>
    <img v-if="image" :class="`py-1 px-1 rounded-full bg-gray-200 shadow-lg object-cover ${styles ? styles : 'w-12 md:w-20 h-12 md:h-20'}`" :src="image" alt="">
    <img v-else :class="`py-1 px-1 rounded-full bg-gray-200 shadow-lg ${styles ? styles : 'w-12 md:w-20'}`" src="../assets/profile.png" alt="">
</template>
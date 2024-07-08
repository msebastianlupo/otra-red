<script>
    import HeadLine2 from './HeadLine2.vue'
    import ProfileImage from './ProfileImage.vue'
    export default {
        name: 'ProfileCard',
        components: {HeadLine2, ProfileImage},
        props: {
            user: Object,
            chat: false,
            editImg: false

        }
    }
</script>

<template>
    <div>
        <div class="flex flex-col items-center">
            <div>
                <router-link :to="`/imagen-perfil`" v-if="editImg"><font-awesome-icon class="relative top-14 left-32 h-4 p-2 bg-gray-200 rounded-full align-middle text-indigo-500" icon="image" /></router-link>
                <ProfileImage :image="user.image" styles="w-40 h-40 mb-4" />
            </div>
            <div class="flex gap-4 items-center">
                <h2 class="text-2xl text-center">{{user.name}} ({{user.userName}})</h2>
                <router-link :to="`/chat-privado/${user.id}`" v-if="chat"><font-awesome-icon class="h-4 p-2 bg-indigo-500 rounded align-middle text-white" icon="envelope" /></router-link>
            </div>
            <p v-if="user.description" class="mt-2 whitespace-pre-wrap text-center">{{user.description}}</p>
        </div>
    </div>
</template>
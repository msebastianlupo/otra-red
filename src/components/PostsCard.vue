<script>
    import BasicLink from './BasicLink.vue'
    import ProfileImage from './ProfileImage.vue'
    import LinkComment from './LinkComment.vue'
    import LinkPen from './LinkPen.vue'
    import LinkTrash from './LinkTrash.vue'
    export default {
        name: 'PostsCard',
        components: {BasicLink, ProfileImage, LinkComment, LinkPen, LinkTrash},
        props: {
            postsArray: Array,
            authUserId: String
        }
    }
</script>

<template>
    <div class="mb-10 flex flex-col md:flex-row md:gap-2" v-for="post in postsArray">
        <div class="min-w-24 flex md:flex-col items-center gap-2 md:gap-0 font-medium text-lg md:text-xs md:text-center">
            <BasicLink :to="`/usuario/${post.userId}`" title="Ver perfil">
                <ProfileImage :image="post.userImage" styles="w-10 md:w-16 h-10 md:h-16 md:mt-5" />
            </BasicLink>
            <BasicLink :to="`/usuario/${post.userId}`" title="Ver perfil">{{post.userName}}</BasicLink>
        </div>
        <div class="grow">
            <div class="mt-2 bg-slate-100 p-4 rounded">
                <router-link :to="`/ver/${post.id}`" class="block mt-2 mb-4 text-xs font-medium">{{post.created}}hs</router-link>
                <div class="overflow-x-hidden max-h-screen whitespace-pre-wrap">
                    <p class="pt-2">{{post.content}}</p>
                    <img v-if="post.image" class="mt-3 rounded" :src="post.image" alt="">
                </div>
                <div class="mt-4 flex justify-end">
                    <LinkComment :to="`/ver/${post.id}`" />
                    <template v-if="authUserId === post.userId">
                        <LinkPen :to="`/editar-publicacion/${post.id}`" />
                        <LinkTrash :to="`/eliminar-publicacion/${post.id}`" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
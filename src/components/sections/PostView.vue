<script>
    import { subscribeToAuth } from '../../services/auth'
    import { getPost } from '../../services/posts'
    import Loader from '../Loader.vue'
    import BasicLink from '../BasicLink.vue'
    import ProfileImage from '../ProfileImage.vue'
    import LinkPen from '../LinkPen.vue'
    import LinkTrash from '../LinkTrash.vue'
    import CommentsBox from '../CommentsBox.vue'
    export default {
        name: 'PostView',
        components: {Loader, BasicLink, ProfileImage, LinkPen, LinkTrash, CommentsBox},
        data(){
            return {
                authUser: {
                    id: null,
                    email: null,
                    name: null,
                    userName: null,
                    description: null,
                    image: null
                },
                post: {
                    id: "",
                    userId: "",
                    userName: "",
                    userImage: null,
                    content: "",
                    created: ""
                },
                unsubscribeFromAuth: () => {},
                loader: false
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData)
            this.loader = true
            getPost(this.$route.params.id)
            .then(post => {
                this.loader = false
                this.post = post
            })
            .catch(e => {
                this.$router.push({
                    path: '/error'
                })
            })
        },
        unmounted(){
            this.unsubscribeFromAuth()
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <template v-if="!loader">
        <div class="mt-2 p-4 shadow-md min-h-20 rounded">
            <div class="flex font-medium text-md gap-3 items-center">
                <BasicLink :to="`/usuario/${post.userId}`" title="Ver perfil">
                    <ProfileImage :image="post.userImage" />
                </BasicLink>
                <div>
                    <div>
                        <BasicLink :to="`/usuario/${post.userId}`" title="Ver perfil">{{post.userName}}</BasicLink>
                    </div>
                    <p class="mt-1 text-xs font-medium">{{post.created}}hs</p>
                </div>
            </div>
            <p class="pt-5 overflow-x-hidden whitespace-pre-wrap">{{post.content}}</p>    
            <img v-if="post.image" class="mt-3 rounded" :src="post.image" alt="">
            <div v-if="post.userId === authUser.id" class="mt-4 flex justify-end">
                <LinkPen :to="`/editar-publicacion/${post.id}`" />
                <LinkTrash :to="`/eliminar-publicacion/${post.id}`" />
            </div>
        </div>
        <CommentsBox v-if="authUser.id" :user="authUser" :postId="post.id" />
    </template>
</template>
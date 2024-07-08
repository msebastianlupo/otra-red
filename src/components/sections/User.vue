<script>
    import { subscribeToAuth } from '../../services/auth'
    import { getUserPosts } from '../../services/posts'
    import { getUserProfile } from '../../services/users'
    import Loader from '../Loader.vue'
    import ProfileCard from '../ProfileCard.vue'
    import HeadLine2 from '../HeadLine2.vue'
    import PostsCard from '../PostsCard.vue'
    export default {
        name: 'Profile',
        components: {Loader, ProfileCard, PostsCard, HeadLine2},
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
                posts: [],
                otherUser: {
                    id: null,
                    email: null,
                    name: null,
                    userName: null,
                    description: null,
                    image: null
                },
                unsubscribeFromAuth: () => {},
                loader: false
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
                this.loader = true
                this.authUser = newUserData
            })
            getUserProfile(this.$route.params.id)
            .then(user => {
                this.otherUser = user
                if(this.$route.params.id === this.authUser.id){
                    this.$router.push({
                        path: '/perfil'
                    })
                }
                getUserPosts(this.$route.params.id)
                .then(posts => {
                    this.loader = false
                    this.posts = posts
                })
            })
            .catch(e => {
                this.$router.push({
                    path: '/perfil'
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
        <ProfileCard :user="otherUser" :chat="true" />
        <HeadLine2 styles="mt-20">Publicaciones</HeadLine2>
        <PostsCard v-if="posts.length" :authUserId="authUser.id" :postsArray="posts" />
        <template v-else>
            <div v-if="!loader" class="text-center">
                <img class="inline mb-4" src="../../assets/empty.png" alt="sin publicaciones">
                <p><b>{{otherUser.userName}}</b> no tiene publicaciones</p>
            </div>
        </template>
    </template>
</template>

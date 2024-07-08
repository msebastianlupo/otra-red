<script>
    import { subscribeToAuth } from '../../services/auth'
    import { getPosts } from '../../services/posts'
    import Loader from '../Loader.vue'
    import PostsCard from '../PostsCard.vue'
    import Link from '../Link.vue'
    export default {
        name: 'Profile',
        components: {Loader, PostsCard, Link},
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
                unsubscribeFromAuth: () => {},
                loader: false
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData)
            this.loader = true
            getPosts()
            .then(posts => {
                this.loader = false
                this.posts = posts
            })
            .catch(e => {
                this.loader = false
                console.log("No se pudieron obtener las publicaciones")
            })
        },
        unmounted(){
            this.unsubscribeFromAuth()
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <PostsCard v-if="posts.length" :authUserId="authUser.id" :postsArray="posts" />
    <template v-else>
        <div v-if="!loader" class="text-center">
            <img class="inline mb-4" src="../../assets/empty.png" alt="sin publicaciones">
            <p>Nada por acá. <Link to="/publicar" text="Publicar" /></p>
        </div>
    </template>
</template>
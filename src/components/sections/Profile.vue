<script>
    import { subscribeToAuth } from '../../services/auth'
    import { getUserPosts } from '../../services/posts'
    import { getUserProfile } from '../../services/users'
    import Loader from '../Loader.vue'
    import ProfileCard from '../ProfileCard.vue'
    import HeadLine2 from '../HeadLine2.vue'
    import PostsCard from '../PostsCard.vue'
    import Link from '../Link.vue'
    export default {
        name: 'Profile',
        components: {Loader, ProfileCard, PostsCard, HeadLine2, Link},
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
            getUserPosts(this.authUser.id)
            .then(posts => {
                this.posts = posts
                return getUserProfile(this.authUser.id)
            })
            .then(user => {
                this.loader = false
            })
            .catch(e => {
                this.loader = false
                console.log("No se pudo obtener la lista de publicaciones")
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
        <ProfileCard :user="authUser"  :editImg="true" />
        <HeadLine2 styles="mt-20">Publicaciones</HeadLine2>
        <PostsCard v-if="posts.length" :authUserId="authUser.id" :postsArray="posts" />
        <template v-else>
            <div v-if="!loader" class="text-center">
                <img class="inline mb-4" src="../../assets/empty.png" alt="sin publicaciones">
                <p>Nada por acá. <Link to="/publicar" text="Publicar" /></p>
            </div>
        </template>
    </template>
</template>

<script>
    import { subscribeToAuth } from '../../services/auth'
    import { getIfAuthor } from '../../services/posts'
    import PostForm from '../PostForm.vue'
    import Loader from '../Loader.vue'
    export default {
        name: 'PostModifier',
        components: {Loader, PostForm},
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
                    id: null,
                    userName: null,
                    content: null,
                    created: null
                },
                loader: false,
                unsubscribeFromAuth: () => {},
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData)
            this.loader = true
            getIfAuthor(this.authUser.id, this.$route.params.id)
            .then(post => {
                this.post = post
                this.loader = false
            })
            .catch(e => 
                this.$router.push({
                    path: '/error'
                })
            )
        },
        unmounted(){
            this.unsubscribeFromAuth()
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <PostForm v-if="authUser.id && post.id" :user="authUser" :previusPost="post" />
</template>
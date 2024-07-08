<script>
    import { subscribeToAuth } from '../../services/auth'
    import Loader from '../Loader.vue'
    import PostForm from '../PostForm.vue'
    export default {
        name: 'PostCreator',
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
                unsubscribeFromAuth: () => {},
                loader: false
            }
        },
        mounted(){
            this.loader = true
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
                this.authUser = newUserData
                this.loader = false
            })
        },
        unmounted(){
            this.unsubscribeFromAuth()
        }
    }
</script>

<template>
    <Loader v-if="loader" />
    <PostForm v-if="authUser.id" :user="authUser" />
</template>
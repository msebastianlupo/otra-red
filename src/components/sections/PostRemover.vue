<script>
    import { subscribeToAuth } from '../../services/auth'
    import {deletePost, getIfAuthor } from '../../services/posts'
    import Loader from '../Loader.vue'
    import StatusCard from '../StatusCard.vue'
    import BackButton from '../BackButton.vue'
    import DangerSubmit from '../DangerSubmit.vue'
    export default {
        name: 'PostModifier',
        components: {Loader, StatusCard, BackButton, DangerSubmit},
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
                    userName: "",
                    content: "",
                },
                loader: false,
                isTheAuthor: false,
                unsubscribeFromAuth: () => {},
            }
        },
        methods: {
            handleSubmit(){
                this.loader = true
                deletePost(this.post.id)
                .then(post => {
                    this.loader = false
                    this.$router.push({
                        path: '/perfil'
                    })
                })
                .catch(e => {
                    this.loader = false
                    console.log("No se pudo eliminar la publicación")
                })
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData =>this.authUser = newUserData)
            this.loader = true
            getIfAuthor(this.authUser.id, this.$route.params.id)
            .then(post => {
                this.loader = false
                this.post = post
                this.isTheAuthor = true
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
    <Loader v-if="loader" />
    <template v-if="!loader && authUser.id">
        <StatusCard to="/perfil" :user="authUser" title="Ir al perfil" :status="`ORIGEN: ${post.created}hs`" />
        <div v-if="post.content">
            <p class="mt-5 p-4 whitespace-pre-wrap bg-red-100 rounded">{{post.content}}</p>
        </div>
        <form v-if="isTheAuthor" action="#" @submit.prevent="handleSubmit">
            <fieldset class="flex flex-col" :disabled="loader">
                <div class="flex gap-2">
                    <BackButton />
                    <DangerSubmit>Eliminar</DangerSubmit>
                </div>
            </fieldset>
        </form>
    </template>
</template>

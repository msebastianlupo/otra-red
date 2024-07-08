<script>
    import { createPost, modifyPost } from '../services/posts'
    import Loader from './Loader.vue'
    import StatusCard from './StatusCard.vue'
    import ErrorDetails from './ErrorDetails.vue'
    import InputFile from './InputFile.vue'
    import TextEntry from './TextEntry.vue'
    import BackButton from './BackButton.vue'
    import Submit from './Submit.vue'
    export default {
        name: 'PostForm',
        components: {Loader, StatusCard, InputFile, TextEntry, BackButton, Submit, ErrorDetails},
        props: {
            user: Object,
            previusPost: {
                type: Object,
                default: null
            }
        },
        data(){
            return {
                post: {
                    userId: null,
                    userName: null,
                    content: ""
                },
                loader: false,
                image: null,
                preview: null,
                error: "",
                modified: false,
                unsubscribeFromAuth: () => {}
            }
        },
        methods: {
            handleSubmit(){
                this.previusPost ? this.handleModifyPost() : this.handleCreatePost()
            },
            handleCreatePost(){
                if(this.post.content || image){
                    this.loader = true
                    createPost(this.post, this.image)
                    .then(post => {
                        this.$router.push({
                            path: '/perfil'
                        })
                    })
                    .catch(e => {
                        this.loader = false
                        this.error = e
                        console.log(e)
                    })
                }else{
                    this.error = "No se puede crear una publicación sin datos"
                }
            },
            handleModifyPost(){
                if(this.post.content || image){
                    this.loader = true
                    modifyPost(this.previusPost.id, {content: this.post.content}, this.image)
                    .then(post => {
                        this.$router.push({
                            path: '/perfil'
                        })
                    })
                    .catch(e => {
                        this.loader = false
                        this.error = e
                    })
                }else{
                    this.error = "No se puede actualizar una publicación sin datos"
                }
            },
            handleSelection(event){
                if(event.target.files.length){
                    if(this.preview){
                        URL.revokeObjectURL(this.preview)
                    }
                    this.image = event.target.files[0]
                    this.preview = URL.createObjectURL(this.image)
                    this.modified = true
                    this.error = ""
                }
            },
            showInvalidDetails(e){
                this.error = e
            }
        },
        mounted(){
            this.post.userId = this.user.id
            this.post.userName = this.user.userName
            if(this.user.image){
                this.post.userImage = this.user.image
            }
            if(this.previusPost){
                this.post.content = this.previusPost.content
                if(this.previusPost.image){
                    this.preview = this.previusPost.image
                }
            }
        }
    }
</script>

<template>
    <Loader v-if="loader" />
    <template v-if="!loader">
        <StatusCard to="/perfil" :user="user" title="Ir al perfil" status="Ahora mismo" />
        <ErrorDetails v-if="error">{{error}}</ErrorDetails>
        <form action="#" @submit.prevent="handleSubmit">
            <fieldset class="flex flex-col" :disabled="loader">
                <div class="mt-3 mb-1 text-right">
                    <InputFile id="image" text="Seleccionar imagen" styles="mt-4" @changed="handleSelection" @invalid="showInvalidDetails" />
                </div>
                <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <img class="mt-1 bg-gray-200 w-full sm:w-40 sm:h-32 rounded md:object-cover" v-if="preview" :src="preview" alt="">
                    <div class="flex grow">
                        <label class="sr-only" for="content">Contenido</label>
                        <TextEntry id="content" v-model="post.content" @change="this.modified = true" />
                    </div>
                </div>
                <div class="flex gap-2 justify-end">
                    <BackButton :confirm="modified && !!post.content" />
                    <Submit :inactive="!post.content && !image">{{this.previusPost ? 'Modificar' : 'Publicar' }}</Submit>
                </div>
            </fieldset>
        </form>
    </template>
</template>
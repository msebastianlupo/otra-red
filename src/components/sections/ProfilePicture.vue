<script>
    import { subscribeToAuth, updateUserImage } from '../../services/auth'
    import Loader from '../Loader.vue'
    import ErrorDetails from '../ErrorDetails.vue'
    import ProfileImage from '../ProfileImage.vue'
    import InputFile from '../InputFile.vue'
    import Submit from '../Submit.vue'
    import BackButton from '../BackButton.vue'
    export default {
        name: 'ProfilePicture',
        components: {Loader, ErrorDetails, ProfileImage, InputFile, Submit, BackButton},
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
                image: null,
                preview: null,
                loader: false,
                error: null,
                unsubscribeFromAuth: () => {}
            }
        },
        methods: {
            handleSelection(event){
                if(event.target.files.length){
                    if(this.preview){
                        URL.revokeObjectURL(this.preview)
                    }
                    this.image = event.target.files[0]
                    this.preview = URL.createObjectURL(this.image)
                    this.error = ""
                }
            },
            handleSubmit(event){
                if(this.image){
                    this.loader = true
                    updateUserImage(this.image)
                    .then(image => {
                        this.$router.push({
                            path: '/perfil'
                        })
                    })
                    .catch(e => {
                        this.loader = false
                        this.error = e
                    })
                }else{
                    this.error = "No seleccionaste ningún archivo"
                }
            },
            showInvalidDetails(e){
                this.error = e
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData)
            this.preview = this.authUser.image
        },
        unmounted(){
            this.unsubscribeFromAuth()
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <ErrorDetails v-if="error">{{error}}</ErrorDetails>
        <form action="#" @submit.prevent="handleSubmit">
        <fieldset class="flex gap-4 md:gap-8 p-4 md:p-8 items-center bg-gray-100 rounded-md" :disabled="loader">
            <ProfileImage :image="preview" styles="w-28 md:w-40 h-28 md:h-40" />
            <div class="flex flex-col">
                <InputFile id="image" styles="mt-0" @changed="handleSelection" @invalid="showInvalidDetails" />
                <Submit :inactive="!image">Cambiar</Submit>
            </div>
        </fieldset>
    </form>
    <BackButton />
</template>
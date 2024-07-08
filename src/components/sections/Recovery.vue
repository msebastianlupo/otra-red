<script>
    import { subscribeToAuth, validateEmail, restorePassword } from '../../services/auth'
    import Loader from '../Loader.vue'
    import ErrorDetails from '../ErrorDetails.vue'
    import InputAny from '../InputAny.vue'
    import Submit from '../Submit.vue'
    export default {
        name: 'Recovery',
        components: {Loader, ErrorDetails, InputAny, Submit},
        data(){
            return {
                authUser: {
                    id: null,
                    email: null
                },
                email: "",
                error: "",
                loader: false
            }
        },
        methods: {
            validateData(){
                if(!validateEmail(this.email)){
                    this.error = "El email es incorrecto"
                    return false
                }
                return true
            },
            handleSubmit(){
                if(this.validateData()){
                    this.loader = true
                    restorePassword(this.email)
                    .then(userData => {
                        sessionStorage.setItem("restore", this.email)
                        this.$router.push({
                            path: '/iniciar-sesion'
                        })
                    })
                    .catch(e => {
                        this.loader = false
                        console.log('No se pudo enviar el email de restablecimiento. ' + e)
                    })
                }
            }
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <ErrorDetails v-if="error">{{error}}</ErrorDetails>
    <form action="#" @submit.prevent="handleSubmit">
        <fieldset class="flex flex-col" :disabled="loader">
            <label class="mt-3" for="email">Email</label>
            <InputAny id="email" v-model="email" required />
            <div>
                <Submit :inactive="!email">Restablecer</Submit>
            </div>
        </fieldset>
    </form>
</template>
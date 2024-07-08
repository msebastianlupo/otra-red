<script>
    import { login, validateEmail, validatePassword } from '../../services/auth'
    import Loader from '../Loader.vue'
    import SuccessDetails from '../SuccessDetails.vue'
    import ErrorDetails from '../ErrorDetails.vue'
    import InputAny from '../InputAny.vue'
    import Submit from '../Submit.vue'
    import BasicLink from '../BasicLink.vue'
    export default {
        name: 'Login',
        components: {Loader, SuccessDetails, ErrorDetails, InputAny, Submit, BasicLink},
        data(){
            return {
                user: {
                    email: '',
                    password: ''
                },
                restoreKey: null,
                error: "",
                loader: false
            }
        },
        methods: {
            validateData(){
                if(!validateEmail(this.user.email)){
                    this.error = "El email es incorrecto"
                    return false
                }
                if(!validatePassword(this.user.password)){
                    this.error = "La contraseña es incorrecta, debe contener 8 caracteres, sin espacios"
                    return false
                }
                return true
            },
            handleSubmit(){
                if(this.validateData()){
                    this.loader = true
                    login(this.user.email, this.user.password)
                    .then(userData => {
                        this.removeSessionKey()
                        this.$router.push({
                            path: '/perfil'
                        })
                    })
                    .catch(e => {
                        this.loader = false
                        this.error = "Credenciales incorrectas"
                        console.log('No se pudo autenticar. ' + e)
                    })
                }
            },
            removeSessionKey(){
                sessionStorage.removeItem("restore")
                this.restoreKey = null
            }
        },
        mounted(){
            this.restoreKey = sessionStorage.getItem("restore")
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <div v-if="restoreKey" class="cursor-not-allowed" title="Quitar este mensaje">
        <SuccessDetails @click="removeSessionKey">Enviamos un correo de restablemiciento a {{restoreKey}}</SuccessDetails>
    </div>
    <ErrorDetails v-if="error">{{error}}</ErrorDetails>
    <form action="#" @submit.prevent="handleSubmit">
        <fieldset class="flex flex-col" :disabled="loader">
            <label class="mt-3" for="email">Email</label>
            <InputAny type="email" id="email" v-model="user.email" maxlength="320" required />
            <label class="mt-3" for="password">Contraseña</label>
            <InputAny type="password" id="password" v-model="user.password" required />
            <div>
                <Submit :inactive="user.email && user.password.length > 7 ? false : true">Iniciar Sesión</Submit>
            </div>
        </fieldset>
    </form>
    <p class="mt-4">¿Olvidaste la contraseña? <BasicLink to="/restablecimiento" ><b class="text-gray-600 hover:text-green-600">Recuperá el acceso</b></BasicLink>.</p>
</template>
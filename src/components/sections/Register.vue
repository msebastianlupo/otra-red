<script>
    import {validateUserName, validateEmail, validatePassword, register } from '../../services/auth'
    import Loader from '../Loader.vue'
    import ErrorDetails from '../ErrorDetails.vue'
    import InputAny from '../InputAny.vue'
    import Submit from '../Submit.vue'
    export default {
        name: 'Register',
        components: {Loader, ErrorDetails, InputAny, Submit},
        data(){
            return {
                user: {
                    userName: '',
                    email: '',
                    password: ''
                },
                error: "",
                loader: false
            }
        },
        methods: {
            validateData(){
                if(!validateUserName(this.user.userName)){
                    this.error = "El nombre de usuario debe ser alfanumérico y en minúsculas, puede contener guiones"
                    return false
                }
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
                    register(this.user.userName, this.user.email, this.user.password)
                    .then(user => this.$router.push(
                        {
                            path: '/perfil'
                        }
                    ))
                    .catch(e => {
                        this.loader = false
                        if(e.code){
                            this.error = "La dirección de correo ya se encuentra registrada"
                        }else{
                            this.error = e
                        }
                        
                    })
                }
            }
        },
    }
</script>

<template>
    <Loader  v-if="loader" />
    <ErrorDetails v-if="error">{{error}}</ErrorDetails>
    <form action="#" @submit.prevent="handleSubmit">
        <fieldset class="flex flex-col" :disabled="loader">
            <label class="mt-3" for="userName">Nombre de usuario</label>
            <InputAny id="userName" v-model="user.userName" maxlength="20" required />
            <label class="mt-3" for="email">Email</label>
            <InputAny type="email" id="email" v-model="user.email" maxlength="320" required />
            <label class="mt-3" for="password">Contraseña</label>
            <InputAny type="password" id="password" v-model="user.password" required />
            <div>
                <Submit :inactive="user.userName.length > 0 && user.userName.length < 21 && user.email && user.password.length > 7 ? false : true">Crear cuenta</Submit>
            </div>
        </fieldset>
    </form>
</template>

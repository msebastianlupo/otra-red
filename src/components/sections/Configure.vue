<script>
    import { subscribeToAuth } from '../../services/auth'
    import { getUserProfile, modifyUser } from '../../services/users'
    import { changePassword, validatePassword } from '../../services/auth'
    import Loader from '../Loader.vue'
    import TextEntry from '../TextEntry.vue'
    import InputAny from '../InputAny.vue'
    import SuccessDetails from '../SuccessDetails.vue'
    import ErrorDetails from '../ErrorDetails.vue'
    import HeadLine2 from '../HeadLine2.vue'
    import ConfigFormText from '../ConfigFormText.vue'
    import ConfigFormTextEntry from '../ConfigFormTextEntry.vue'
    import ConfigFormPassword from '../ConfigFormPassword.vue'
    import Submit from '../Submit.vue'
    export default {
        name: 'Configure',
        components: {Loader, SuccessDetails, ErrorDetails, HeadLine2, ConfigFormText, ConfigFormTextEntry, ConfigFormPassword, TextEntry, InputAny, Submit},
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
                password: "",
                success: "",
                error: "",
                unsubscribeFromAuth: () => {},
                loader: false
            }
        },
        methods: {
            handleChangeName(){
                if(this.authUser.name.length < 101){
                    this.loader = true
                    modifyUser(this.authUser.id, {name: this.authUser.name})
                    .then(data => {
                        this.loader = false
                        this.success = "Nombre actualizado"
                        this.error = ""
                    })
                    .catch(e => {
                        this.loader = false
                        this.success = ""
                        this.error = "No se pudo actualizar el nombre"
                        console.log(e)
                    })
                }else{
                    this.success = ""
                    this.error = "Nombre demasiado extenso"
                }
            },
            handleChangeDescription(){
                this.loader = true
                modifyUser(this.authUser.id, {description: this.authUser.description})
                .then(data => {
                    this.loader = false
                    this.success = "Descripción actualizada"
                    this.error = ""
                })
                .catch(e => {
                    this.loader = false
                    this.success = ""
                    this.error = "No se pudo actualizar la descripción"
                    console.log(e)
                })
            },
            handleChangePassword(){
                if(validatePassword(this.password)){
                    this.loader = true
                    changePassword(this.password)
                    .then(password => {
                        this.loader = false
                        this.success = "Contraseña actualizada"
                        this.error = ""
                    })
                    .catch(e => {
                        this.loader = false
                        this.success = ""
                        this.error = "No se pudo actualizar la contraseña. Asegurate de haber iniciado sesión recientemente"
                    })
                }else{
                    this.success = ""
                    this.error = "La contraseña es inválida. Debe contener 8 caracteres o más y sin espacios"
                }
            }
        },
        mounted(){
            this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
                this.loader = true
                this.authUser = newUserData
                getUserProfile(this.authUser.id)
                .then(user => {
                    this.loader = false
                    this.authUser.name = user.name
                    this.authUser.description = user.description
                })
                .catch(e => console.log("No se pudo obtener el perfil de usuario"))
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
        <SuccessDetails v-if="success">{{success}}</SuccessDetails>
        <ErrorDetails v-if="error">{{error}}</ErrorDetails>
        <HeadLine2>Datos a mostrar (opcional)</HeadLine2>
        <ConfigFormText id="name" text="Nombre" btn="Guardar" :loader="loader" v-model="authUser.name" @submit.prevent="handleChangeName" />
        <ConfigFormTextEntry id="description" text="Descripción general" btn="Guardar" :loader="loader" v-model="authUser.description" @submit.prevent="handleChangeDescription" />
        <HeadLine2 styles="mt-20">Cambiá la clave de acceso</HeadLine2>
        <ConfigFormPassword id="password" text="Contraseña" btn="Cambiar" :loader="loader" v-model="password" @submit.prevent="handleChangePassword" />
    </template>
</template>
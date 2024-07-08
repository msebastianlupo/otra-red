<script>
    import { subscribeToAuth, logout } from '../services/auth'
    import SearchBox from './SearchBox.vue'
    import ProfileImage from './ProfileImage.vue'
    export default {
        name: 'NavigationBar',
        components: {SearchBox, ProfileImage},
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
                menuIsTrue: false,
                searchIsTrue: false,
                unsubscribeFromAuth: () => {}
            }
        },
        methods: {
            handleLogout(){
                logout()
                .then(data => {
                    this.$router.push({
                        path: '/iniciar-sesion'
                    })
                })
            },
            toggleMenu(){
                this.menuIsTrue = !this.menuIsTrue
                this.searchIsTrue = false
            },
            hideMenu(){
                setTimeout(() => {
                    this.menuIsTrue = false
                    this.searchIsTrue = false
                }, 150)
            },
            toggleSearchBox(){
                this.searchIsTrue = !this.searchIsTrue
            },
            hideSearchBox(){
                this.searchIsTrue = false
            }
        },
        mounted(){
            this.unsubcribeToAuth = subscribeToAuth(newUserData => this.authUser = newUserData)
        },
        unmounted(){
            this.unsubscribeFromAuth()
        }
    }
</script>

<template>
    <div class="fixed w-full top-0 left-0 text-white z-50">
        <nav class="bg-indigo-600 p-2 px-4 m-auto">
            <ul class="flex justify-between items-center text-3xl">
                <li  @click="hideSearchBox"><router-link to="/"><img class="h-10" src="../assets/or.svg" alt=""></router-link></li>
                <li class="block">
                    <ul class="flex gap-2 sm:gap-11 text-2xl font-medium">
                        <li @click="hideSearchBox">
                            <router-link class="flex flex-col items-center group" to="/"><font-awesome-icon class="p-3 sm:p-4 rounded hover:bg-indigo-700 text-gray-200" icon="house" /><span class="absolute top-20 text-sm hidden group-hover:block p-2 rounded bg-indigo-700">Novedades</span></router-link>
                        </li>
                        <li  @click="hideSearchBox">
                            <router-link class="flex flex-col items-center group" to="/publicar"><font-awesome-icon class="p-3 sm:p-4 rounded hover:bg-indigo-700 text-gray-200" icon="pen" /><span class="absolute top-20 text-sm hidden group-hover:block p-2 rounded bg-indigo-700">Publicar</span></router-link>
                        </li>
                        <li @click="toggleSearchBox">
                            <div class="flex flex-col items-center group">
                                <font-awesome-icon class="p-3 sm:p-4 rounded hover:bg-indigo-700 text-gray-200 cursor-pointer" icon="users" />
                                <span class="absolute top-20 text-sm hidden group-hover:block p-2 rounded bg-indigo-700">Buscar usuario</span>
                            </div>
                        </li>
                    </ul>
                </li>
                <li class="block" @click="toggleMenu" @blur="hideMenu" tabindex="1" title="Opciones">
                    <template v-if="authUser.id">
                        <ProfileImage :image="authUser.image" styles="w-10 h-10 p-0.5 rounded-full bg-white cursor-pointer focus:outline-none" />
                    </template>
                    <template v-else>
                        <font-awesome-icon class="cursor-pointer focus:outline-none" icon="right-to-bracket" />
                    </template>
                    <div v-show="menuIsTrue" class="absolute right-2 mt-6 p-2 bg-indigo-600 rounded">
                        <template v-if="authUser.id">
                            <ul class="p-2 flex flex-col text-xl gap-1">
                                <li>
                                    <router-link to="/Perfil" class="flex items-center gap-4"><font-awesome-icon icon="user" /><span>{{authUser.userName}}</span></router-link>
                                </li>
                                <li>
                                    <router-link to="/Configuracion" class="flex items-center gap-4"><font-awesome-icon icon="gear" /><span>Configuración</span></router-link>
                                </li>
                                <li>
                                    <form action="#" @submit.prevent="handleLogout">
                                        <button class="mt-4 w-full bg-orange-500 hover:bg-orange-400 p-1 px-8 rounded text-lg" type="submit">Cerrar Sesión</button>
                                    </form>
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <ul class="p-2 flex flex-col text-xl gap-1">
                                <li>
                                    <router-link to="/iniciar-sesion"><font-awesome-icon icon="key" /><span class="ml-4">Iniciar Sesión</span></router-link>
                                </li>
                                <li>
                                    <router-link to="/registro"><font-awesome-icon icon="user-plus" /><span class="ml-4">Registrarse</span></router-link>
                                </li>
                            </ul>
                        </template>
                    </div>
                </li>
            </ul>
        </nav>
        <template v-if="searchIsTrue && this.authUser.id">
            <SearchBox @hideMe="hideSearchBox" />
        </template>
    </div>
</template>
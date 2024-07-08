<script>
    import { searchUsers } from '../services/users'
    import InputAny from './InputAny.vue'
    import BasicLink from './BasicLink.vue'
    import ProfileImage from './ProfileImage.vue'
    import Link from './Link.vue'
    export default {
        name: 'SearchBox',
        emits: ['hideMe'],
        components: {InputAny, BasicLink, ProfileImage, Link},
        data(){
            return {
               searchValue: "",
               searchFired: false,
               searchResults: []
            }
        },
        methods: {
            handleSearch(){
                searchUsers(this.searchValue)
                .then(users => {
                    this.searchFired = true
                    this.searchResults = users
                })
                .catch(e => console.log("No se pudo obtener resultados de usuarios"))
            },
            resetSearch(){
                this.searchValue = ""
                this.searchResults = []
                this.$emit('hideMe')
            }
        }
    }
</script>

<template>
    <form action="#" class="p-2 md:p-4 bg-indigo-600" @submit.prevent="handleSearch">
        <div class="flex gap-2">
            <label class="sr-only" for="search">Búsqueda de usuarios</label>
            <input class="p-2 lg:p-4 md:text-2xl rounded text-gray-600 grow outline-0 focus:bg-gray-100" type="text" id="search" v-model.trim="searchValue" placeholder="Buscá un usuario específico">
            <input class="bg-orange-500 p-2 px-4 lg:text-lg rounded font-medium cursor-pointer hover:bg-orange-600 transition-all" type="submit" value="Buscar">
        </div>
    </form>
    <template v-if="searchResults.length">
        <ul>
            <li class="flex gap-2 items-center p-3 px-8 bg-indigo-700 text-lg" v-for="user in searchResults">
                <BasicLink :to="`/usuario/${user.id}`" title="Ver perfil">
                    <ProfileImage :image="user.image" styles="w-8" />
                </BasicLink>
                <router-link class="font-medium" :to="`/usuario/${user.id}`" @click="resetSearch">{{user.userName}}</router-link>
            </li>
        </ul>
    </template>
    <div v-else-if="searchFired" class="p-2 bg-indigo-600 text-center text-white">
        <p>Búsqueda sin resultados</p>
    </div>
</template>
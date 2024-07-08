import { createRouter, createWebHashHistory } from 'vue-router'
import { subscribeToAuth } from '../services/auth'
import NotFound from '../components/NotFound.vue'
import NewPosts from '../components/sections/NewPosts.vue'
import Profile from '../components/sections/Profile.vue'
import Login from '../components/sections/Login.vue'
import Register from '../components/sections/Register.vue'
import User from '../components/sections/User.vue'
import Configure from '../components/sections/Configure.vue'
import PostCreator from '../components/sections/PostCreator.vue'
import PostView from '../components/sections/PostView.vue'
import PostModifier from '../components/sections/PostModifier.vue'
import PostRemover from '../components/sections/PostRemover.vue'
import Recovery from '../components/sections/Recovery.vue'
import PrivateChat from '../components/sections/PrivateChat.vue'
import ProfilePicture from '../components/sections/ProfilePicture.vue'

const routes = [
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        meta: { restricted: false, title: "Error 404: el recurso no existe" }
    },
    {
        path: '/',
        component: NewPosts,
        meta: { restricted: true, title: "Últimas publicaciones en O.R." }
    },
    {
        path: '/error',
        component: NotFound,
        meta: { restricted: false, title: "Error 400: solicitud de datos incorrecta" }
    },
    {
        path: '/perfil',
        component: Profile,
        meta: { restricted: true, title: "Perfil" }
    },
    {
        path: '/iniciar-sesion',
        component: Login,
        meta: { restricted: false, title: "Iniciá sesión para continuar" }
    },
    {
        path: '/registro',
        component: Register,
        meta: { restricted: false, title: "Registrate" }
    },
    {
        path: '/usuario/:id',
        component: User,
        meta: { restricted: true, title: "Usuario" }
    },
    {
        path: '/configuracion',
        component: Configure,
        meta: { restricted: true, title: "Configuración de cuenta" }
    },
    {
        path: '/publicar',
        component: PostCreator,
        meta: { restricted: true, title: "Publicar" }
    },
    {
        path: '/ver/:id',
        component: PostView,
        meta: { restricted: true, title: "Ver publicación" }
    },
    {
        path: '/editar-publicacion/:id',
        component: PostModifier,
        meta: { restricted: true, title: "Modificar publicación" }
    },
    {
        path: '/eliminar-publicacion/:id',
        component: PostRemover,
        meta: { restricted: true, title: "Eliminar publicación" }
    },
    {
        path: '/restablecimiento',
        component: Recovery,
        meta: { restricted: false, title: "Restablecimiento de contraseña" }
    },
    {
        path: '/chat-privado/:id',
        component: PrivateChat,
        meta: { restricted: true, title: "Chat privado" }
    },
    {
        path: '/imagen-perfil/',
        component: ProfilePicture,
        meta: { restricted: true, title: "Imagen de perfil" }
    }

]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
    scrollBehavior(){
        return new Promise((resolve) => {
            resolve({ left: 0, top: 0 })
        })
    }
})

let authUser = {
    id: null,
    email: null
}

subscribeToAuth(newUserData => authUser = newUserData)

router.beforeEach((to, from) => {
    document.title = "O.R. :: " + to.meta.title
    if(!authUser.id && to.meta.restricted){
        return {
            path: '/iniciar-sesion'
        }
    }else if(authUser.id){
        if(to.path == '/iniciar-sesion' || to.path == '/registro' || to.path == '/restablecimiento'){
            return {
                path: '/perfil'
            }
        }
    }
}) 

export default router
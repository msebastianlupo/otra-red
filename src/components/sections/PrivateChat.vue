<script>
    import { subscribeToAuth } from '../../services/auth'
    import { subscribeToPrivateChat, saveMessage, deleteChat} from '../../services/private-chats'
    import { getUserProfile } from '../../services/users'
    import Loader from '../Loader.vue'
    import Confirm from '../Confirm.vue'
    import ProfileImage from '../ProfileImage.vue'
    import HeadLine2 from '../HeadLine2.vue'
    import TextEntryForChat from '../TextEntryForChat.vue'
    import LinkEye from '../LinkEye.vue'
    import SubmitTrash from '../SubmitTrash.vue'
    import Submit from '../Submit.vue'
    export default {
        name: 'PrivateChat',
        components: {Loader, Confirm, ProfileImage, HeadLine2, TextEntryForChat, LinkEye, SubmitTrash, Submit},
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
                theOther: {
                    id: null,
                    email: null,
                    name: null,
                    userName: null,
                    description: null,
                    image: null
                },
                showDialog: false,
                message: "",
                messages: [],
                unsubscribeFromAuth: () => {},
                unsubscribeFromPrivateChat: () => {},
                loader: false,
                sending: false
            }
        },
        methods: {
            handleSubmit(){
                this.sending = true
                saveMessage(this.authUser.id, this.theOther.id, this.message)
                .then(message => {
                    this.message = ""
                    this.sending = false
                })
                .catch(e => this.sending = false)
            },
            askDelete(){
                this.showDialog = true
            },
            hideDialog(){
                this.showDialog = false
            },
            removeChat(){
                this.showDialog = false
                this.loader = true
                deleteChat(this.authUser.id, this.theOther.id)
                .then(chat => this.loader = false)
                .catch(e => {
                    this.loader = false
                    console.log("no se pudo eliminar el chat " + e)
                })
            },
        },
        mounted(){
            subscribeToAuth(newUserData => this.authUser = newUserData)
            this.loader = true
            getUserProfile(this.$route.params.id)
            .then(user => {
                if(user.id !== this.authUser.id){
                    return this.theOther = user
                }else{
                    const errMessage = 'no podés chatear con vos mismo/a'
                    console.warn(errMessage)
                    throw(errMessage)
                }
            })
            .then(async user => {
                this.unsubscribeFromPrivateChat = await subscribeToPrivateChat(this.authUser.id, this.theOther.id, messages => {
                    this.messages = messages
                    window.scrollTo(0, document.body.scrollHeight)
                    this.loader = false
                })
            })
            .catch(e => 
                this.$router.push({
                    path: '/error'
                })
            )
        },
        unmounted(){
            this.unsubscribeFromAuth()
            this.unsubscribeFromPrivateChat()
        }
    }
</script>

<template>
    <Loader  v-if="loader" />
    <template v-else>
        <Confirm v-if="showDialog" text="¿Eliminar la conversación?" @enableAction="removeChat" @disableAction="hideDialog" />
        <div class="sticky top-20 mb-10 p-1 bg-white">
            <div class="flex gap-2 items-center pb-2 border-b-2 border-gray-100">
                <div class="py-1">
                    <ProfileImage :image="theOther.image" styles="w-16 md:w-20 h-16 md:h-20" />
                </div>
                <div>
                    <p class="text-indigo-400 text-xl ml-2">{{theOther.userName}}</p>
                    <div class="flex">
                        <LinkEye title="Ver perfil" :to="`/usuario/${theOther.id}`" />
                        <form action="#" title="Eliminar conversación" @submit.prevent="askDelete">
                            <SubmitTrash />
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <ul class="flex flex-col items-start mt-32" v-if="messages.length">
            <li :class="`p-2 rounded mb-2 ${message.senderId == authUser.id ? 'bg-green-100 self-end' : 'bg-blue-100'}`" v-for="message in messages">
                <p class="xl:max-w-60 overflow-hidden text-ellipsis overflow-x-hidden whitespace-pre-wrap">{{message.content}}</p>
                <p class="pt-2 text-right text-[10px] font-medium cursor-default" :title="message.created + 'hs'">{{message.created ? message.created + 'hs' : 'Enviando...'}}</p>
            </li>
        </ul>
        <form class="mt-20" action="#" @submit.prevent="handleSubmit">
            <fieldset class="flex flex-col" :disabled="loader">
                <TextEntryForChat :sending="sending" :inactive="!message" v-model="message" />
            </fieldset>
        </form>
    </template>
</template>

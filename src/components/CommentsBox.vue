<script>
    import { getPostComments, addComment, deleteComment } from '../services/comments'
    import Confirm from './Confirm.vue'
    import Loader from './Loader.vue'
    import BasicLink from './BasicLink.vue'
    import ProfileImage from './ProfileImage.vue'
    import Submit from './Submit.vue'
    import HeadLine2 from './HeadLine2.vue'
    import SubmitTrash from './SubmitTrash.vue'
    import ErrorDetails from './ErrorDetails.vue'
    import TextEntry from './TextEntry.vue'
    export default {
        name: 'CommentsBox',
        components: {Confirm, Loader, BasicLink, ProfileImage, Submit, HeadLine2, SubmitTrash, ErrorDetails, TextEntry},
        props: {
            user: Object,
            postId: String
        },
        data(){
            return {
                showDialog: false,
                toDelete: {
                    userId: "",
                    commentId: ""
                },
                error: "",
                comments: [],
                comment: {
                    userName: "",
                    userId: "",
                    userImage: null,
                    comment: ""
                },
                loader: false
            }
        },
        methods: {
            handleSubmit(){
                if(this.comment.comment){
                    this.loader = true
                    addComment(this.$route.params.id, this.comment)
                    .then(comment => {
                        this.loader = false
                        this.error = ""
                        this.comment.comment = ""
                        this.fetchComments()
                        this.scrollToComment()
                    })
                    .catch(e => {
                        this.loader = false
                        console.log("No se pudo añadir el comentario")
                    })
                }else{
                    this.error = "No se puede comentar la publicación sin datos"
                }
            },
            askDelete(userId, commentId){
                this.showDialog = true
                this.toDelete = {userId, commentId}
            },
            hideDialog(){
                this.showDialog = false
            },
            removeComment(){
                if(this.user.id === this.toDelete.userId){
                    this.showDialog = false
                    this.loader = true
                    deleteComment(this.$route.params.id, this.toDelete.commentId)
                    .then(comment => {
                        this.fetchComments()
                    })
                    .catch(e => {
                        this.loader = false
                        console.log("no se pudo eliminar el comentario " + e)
                    })
                }else{
                    console.log("no sos el titular del comentario")
                }
            },
            fetchComments(){
                this.loader = true
                getPostComments(this.postId)
                .then(comments => {
                    this.loader = false
                    this.comments = comments
                })
                .catch(e => console.log("No se pudo obtener la lista de comentarios"))
            },
            scrollToComment(){
                window.scroll({
                    top: document.querySelector("#comments").offsetTop,
                    left: 0
                })
            }
        },
        mounted(){
            this.comment.userId = this.user.id
            this.comment.userName = this.user.userName
            if(this.user.image){
                this.comment.userImage = this.user.image
            }
            this.fetchComments()
        }
    }
</script>

<template>
    <Loader v-if="loader" />
    <Confirm v-if="showDialog" @enableAction="removeComment" @disableAction="hideDialog" text="¿Eliminar comentario?" />
    <div class="mt-4">
        <HeadLine2 id="comments" styles="mt-20">{{comments.length ? `Comentarios (${comments.length})` : 'Sin comentarios'}}</HeadLine2>
        <div class="mt-4 p-2 rounded border-b-2 border-gray-100" v-for="comment in comments">
            <div class="mt-2 min-h-20 rounded">
                <div class="flex font-medium text-md gap-2 items-center">
                    <BasicLink to="/" title="Ver perfil">
                        <ProfileImage :image="comment.userImage" styles="w-12 md:w-14 h-12 md:h-14" />
                    </BasicLink>
                    <div>
                        <div>
                            <BasicLink :to="`/usuario/${comment.userId}`" title="Ver perfil">{{comment.userName}}</BasicLink>
                        </div>
                        <p class="text-xs font-medium">{{comment.created}}hs</p>
                    </div>
                </div>
                <p class="pt-4 overflow-x-hidden max-h-screen whitespace-pre-wrap">{{comment.comment}}</p>
                <div v-if="comment.userId === user.id" class="mt-4 flex justify-end">
                    <form action="#" @submit.prevent="askDelete(comment.userId, comment.id)">
                        <SubmitTrash />
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div>
        <ErrorDetails v-if="error">{{error}}</ErrorDetails>
        <form action="#" @submit.prevent="handleSubmit">
            <fieldset class="flex flex-col" :disabled="loader">
                <label class="mt-16" for="comment">Comentá</label>
                <TextEntry id="comment" v-model="comment.comment" />
                <div>
                    <Submit :inactive="!comment.comment">Comentar</Submit>
                </div>
            </fieldset>
        </form>
    </div>
</template>
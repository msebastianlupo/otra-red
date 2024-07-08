import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import { db } from './firebase'
import { getPosts } from './posts'
import { formatDate } from './helpers'

/**
 * mapea los comentarios y los devuelve en un formato más accesible
 * @param {array} posts
 * @returns {array}
 */
function mapComments(comments){
    const mappedComments = comments.docs.map(doc => {
        return {
            id: doc.id,
            userName: doc.data().userName,
            userId: doc.data().userId,
            userImage: doc.data().userImage,
            comment: doc.data().comment,
            created: formatDate(doc.data().created.toDate())
        }
    })
    return mappedComments
}

/**
 * devuelve todos los comentarios de una publicación
 * @param {string} postId
 * @returns {Promise<array>}
 */
async function getPostComments(postId){
    const refComments = collection(db, `posts/${postId}/comments`)
    const q = query(refComments, orderBy('created', 'desc'))
    const comments = await getDocs(q)

    return mapComments(comments)
}

/**
 * añade un comentario en la publicación especificada
 * @param {string} postId 
 * @param {object} data 
 * @returns {Promise<void>}
 */
async function addComment(postId, data){
    const refComments = collection(db, `posts/${postId}/comments`)
    return addDoc(refComments, {
        ...data,
        created: serverTimestamp()
    })
}

/**
 * elimina un comentario en la publicación especificada
 * @param {string} postId 
 * @param {string} commentId 
 * @returns {Promise<void>}
 */
async function deleteComment(postId, commentId){
    const refComment = doc(db, `posts/${postId}/comments/${commentId}`)
    return deleteDoc(refComment)
}

/**
 * elimina todos los comentarios de una publicación y devuelve el total
 * @param {string} postId
 * @returns {number}
 */
async function deleteAllComments(postId){
    const comments = await getPostComments(postId)
    comments.forEach(comment => {
        deleteComment(postId, comment.id)
    })
    return comments.length
}

/**
 * devuelve todos los comentarios de un usuario específico
 * @param {string} userId
 * @returns {Promise<array>}
 */
async function getUserComments(postId, userId){
    const refComments = collection(db, `posts/${postId}/comments`)
    const q = query(refComments, where('userId', '==', userId))
    const comments = await getDocs(q)
    return mapComments(comments)
}

/**
 * actualiza todos los comentarios de un usuario con el/los datos proporcionados
 * @param {string} userId 
 * @param {Promise<void>} data 
 * @returns {Promise<void>}
 */
async function updateUserComments(userId, data){
    const posts = await getPosts()
    return posts.forEach(async post => {
        const comments = await getUserComments(post.id, userId)
        comments.forEach(comment => {
            const refComment = doc(db, `posts/${post.id}/comments/${comment.id}`)
            updateDoc(refComment, {...data})
        })
    })
}

export {
    getPostComments,
    addComment,
    deleteComment,
    deleteAllComments,
    updateUserComments
}
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from './firebase'
import { formatDate } from './helpers'
import { deleteAllComments } from './comments'
import { getFileUrl, removeFile, uploadFile } from './file-storage'


/**
 * devuelve una publicación por medio de su id
 * @param {string} id
 * @returns {Promise<void>}
 */
async function getPost(id){
    const refPost = doc(db, `posts/${id}`)
    const postDoc = await getDoc(refPost)
    if(postDoc?.data()?.userId){
        return {
            id: postDoc.id,
            userName: postDoc.data().userName,
            userId: postDoc.data().userId,
            userImage: postDoc.data().userImage,
            content: postDoc.data().content,
            image: postDoc.data().image,
            created: formatDate(postDoc.data().created.toDate())
        }
    }
    throw('error: la publicación no existe')
}

/**
 * mapea las publicaciones y las devuelve en un formato más accesible
 * @param {array} posts
 * @returns {array}
 */
function mapPosts(posts){
    const mappedPosts = posts.docs.map(doc => {
        return {
            id: doc.id,
            userName: doc.data().userName,
            userId: doc.data().userId,
            userImage: doc.data().userImage,
            content: doc.data().content,
            image: doc.data().image,
            created: formatDate(doc.data().created.toDate())
        }
    })
    return mappedPosts
}

/**
 * devuelve todas las publicaciones
 * @returns {Promise<array>}
 */
async function getPosts(){
    const refPosts = collection(db, 'posts')
    const q = query(refPosts, orderBy('created', 'desc'))
    const posts = await getDocs(q)

    return mapPosts(posts)
}

/**
 * devuelve todas las publicaciones de un usuario específico
 * @param {string} userId
 * @returns {Promise<array>}
 */
async function getUserPosts(userId){
    const refPosts = collection(db, `posts/`)
    const q = query(refPosts, orderBy('created', 'desc'), where('userId', '==', userId))
    const posts = await getDocs(q)

    return mapPosts(posts)
}

/**
 * crea una publicación. opcionalmente recibe una imagen
 * @param {{userId: string, content: string}} data
 * @param {File|null} image
 * @returns {Promise<void>}
 */
async function createPost(data, image=null){
    const refPosts = collection(db, 'posts')
    if(image){
        const imageURL = await uploadFile(`users/${data.userId}/posts`, image)
        data.image = imageURL
    }

    return addDoc(refPosts, {
        ...data,
        created: serverTimestamp()
    })
}

/**
 * modifica una publicación. opcionalmente recibe una imagen
 * @param {string} id
 * @param {{postId: string, content: string}} data
 * @param {File|null} image
 * @returns {Promise<void>}
 */
async function modifyPost(id, data, image=null){
    const refPost = doc(db, `posts/${id}`)
    if(image){
        const post = await getPost(id)
        const imageURL = await uploadFile(`users/${post.userId}/posts`, image)
        data.image = imageURL
        await removeFile(post.image)
    }

    return updateDoc(refPost, {
        ...data
    })
}

/**
 * elimina una publicación
 * @param {string} id 
 * @returns {Promise<void>}
 */
async function deletePost(id){
    const refPost = doc(db, `posts/${id}`)
    const post = await getPost(id)
    if(post.image){
        await removeFile(post.image)
    }

    deleteAllComments(id)
    return deleteDoc(refPost)
}

/**
 * devuelve la publicación solo si coincide con el autor pasado como argumento
 * @param {string} userId
 * @param {string} postId
 * @returns {<Promise>}
 */
async function getIfAuthor(userId, postId){
    const post = await getPost(postId)
    if(post.userId === userId){
        return post
    }
    throw('no es posible editar publicaciones de otros usuarios')
}


/**
 * actualiza todas las publicaciones de un usuario con el/los datos proporcionados
 * @param {string} userId 
 * @param {object} data
 * @returns {Promise<void>}
 */
async function updateUserPosts(userId, data){
    const posts = await getUserPosts(userId)
    return posts.forEach(post => modifyPost(post.id, {...data}))
}

export {
    getPost,
    getPosts,
    getUserPosts,
    createPost,
    modifyPost,
    deletePost,
    getIfAuthor,
    updateUserPosts
}
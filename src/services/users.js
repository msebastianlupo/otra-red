import { auth, db } from "./firebase"
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { updateProfile } from "firebase/auth"
import { setUserData } from "./auth"

/**
 * devuelve datos del usuario por medio de su id
 * @param {string} id
 * @returns {Promise}
 */
async function getUserProfile(id){
    const refUser = doc(db, `users/${id}`)
    const userDoc = await getDoc(refUser)
    if(userDoc?.data()?.userName){
        return {
            id: userDoc.id,
            email: userDoc.data().email,
            userName: userDoc.data().userName,
            name: userDoc.data().name,
            description: userDoc.data().description,
            image: userDoc.data().image
        }
    }
    throw("error: el usuario no existe")
}

/**
 * crea un usuario
 * @param {string} id
 * @param {{email: string}} data
 * @returns {Promise<void>}
 */
async function createUserProfile(id, data){
    const refUser = doc(db, `users/${id}`)
    await setDoc(refUser, data)
}

/**
 * modifica el perfil de un usuario
 * @param {string} id
 * @param {object} data
 * @returns {Promise<void>}
 */
async function modifyUser(id, data){
    const refUser = doc(db, `users/${id}`)

    if(data.name){
        await updateProfile(auth.currentUser, {displayName: data.name})
    }

    await updateDoc(refUser, {
        ...data
    })

    setUserData({...data})
}

/**
 * mapea los usuarios y los devuelve en un formato más accesible
 * @param {array} users
 * @returns {array}
 */
function mapUsers(users){
    const mappedUsers = users.docs.map(doc => {
        return {
            id: doc.id,
            email: doc.data().email,
            userName: doc.data().userName,
            name: doc.data().name,
            description: doc.data().description,
            image: doc.data().image
        }
    })
    return mappedUsers
}

/**
 * encuentra usuarios en la base de datos (limitada por el servicio a términos de búsqueda exactos)
 * @param {string} userName
 * @returns {Promise<array>}
 */
async function searchUsers(userName){
    const refUsers = collection(db, `users/`)
    const q = query(refUsers, where('userName', '==', userName))
    const users = await getDocs(q)

    return mapUsers(users)
}

export {
    getUserProfile,
    createUserProfile,
    searchUsers,
    modifyUser
}
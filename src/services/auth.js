import { auth } from './firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, getAuth, updatePassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { createUserProfile, getUserProfile, modifyUser, searchUsers } from './users'
import { removeFile, uploadFile } from './file-storage'
import { updateUserPosts } from './posts'
import { updateUserComments } from './comments'

const nullDataUSer = {
    id: null,
    email: null,
    name: null,
    userName: null,
    description: null,
    image: null
}

let userData = nullDataUSer
let observers = []

if(localStorage.getItem('user')){
    userData = JSON.parse(localStorage.getItem('user'))
} 

/**
 *  cambia el estado de autenticación e informa a todos los observadores
 */
onAuthStateChanged(auth, user => {
    if(user){
        setUserData({
            id: user.uid,
            email: user.email,
            name: user.displayName
        })

        getUserProfile(user.uid)
        .then(profile => setUserData({...profile}))
        
    }else{
        setUserData(nullDataUSer)
    }
    notifyAll()
})

/**
 * agrega un callback al array de observadores. retorna una función para desuscribirse cuando sea necesario
 * @param {() => {}} callback 
 * @returns {() => void}
 */
function subscribeToAuth(callback){
    let previusObservers = [...observers]
    observers.push(callback)
    notify(callback)

    return () => observers = previusObservers
}

/**
 * notifica al observador de los datos de usuario
 * @param {() => {}} observer 
 */
function notify(observer){
    observer({...userData})
}

/**
 * notifica a los observadores
 */
function notifyAll(){
    observers.forEach(observer => notify(observer))
}

/**
 * setea datos a userData y se lo notifica a todos los observadores
 * @param {{}} data 
 */
function setUserData(data){
    userData = {
        ...userData,
        ...data
    }
    localStorage.setItem('user', JSON.stringify(userData))
    notifyAll()
}

/**
 * inicia sesión
 * @param {string} email
 * @param {string} password 
 * @returns {Promise<void>}
 */
async function login(email, password){
    return signInWithEmailAndPassword(auth, email, password)
}

/**
 * cierra la sesión
 * @returns {Promise<void>}
 */
async function logout(){
    localStorage.removeItem('user')
    return signOut(auth)
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<void>}
 */
async function register(userName, email, password){
    const userExists = await searchUsers(userName)
    if(!userExists.length){
        const credentials = await createUserWithEmailAndPassword(auth, email, password)
        return createUserProfile(credentials.user.uid, {userName, email})
    }else{
        throw("El usuario ya existe, seleccioná otro")
    }
}

/**
 * cambia el password de un usuario (debe estar autenticado recientemente)
 * @param {string} password 
 * @returns {Promise<void>}
 */
async function changePassword(password){
    const auth = getAuth()
    const user = auth.currentUser

    return updatePassword(user, password)
}

/**
 * verifica si un nombre de usuario es válido
 * @param {string} userName 
 * @returns {boolean}
 */
function validateUserName(userName){
    if(userName.length && userName.length < 21){
        const nickReg = /^[a-z0-9_-]+$/
        return nickReg.test(userName)
    }
    return false
}

/**
 * verifica si un email es válido
 * @param {string} email 
 * @returns {RegExpMatchArray|null}
 */
function validateEmail(email){
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

/**
 * verifica si el password es de una longitud mínima de 8 caracteres y no contiene espacios
 * @param {string} password
 * @returns {boolean}
 */
function validatePassword(password){
    return password.length > 7 && !password.includes(" ")
}

/**
 * envía un correo de restablecimiento de contraseña
 * @param {string} email 
 * @returns {Promise<void>}
 */
async function restorePassword(email){
    const auth = getAuth()
    return sendPasswordResetEmail(auth, email)
}

/**
 * actualiza la imagen de perfil
 * @param {File} image
 * @returns {Promise<void>}
 */
async function updateUserImage(image){
    if(userData.image){
        await removeFile(userData.image)
    }
    const imageURL = await uploadFile(`users/${userData.id}`, image)
    const authPromise = updateProfile(userData.id, {photoUrl: imageURL})
    const firestorePromise = modifyUser(userData.id, {image: imageURL})
    const postsPromise = updateUserPosts(userData.id, {userImage: imageURL})
    const commentsPromise = updateUserComments(userData.id, {userImage: imageURL})
    await Promise.all([authPromise, firestorePromise, postsPromise, commentsPromise])
    setUserData({image: imageURL})
}

export {
    subscribeToAuth,
    login,
    logout,
    register,
    changePassword,
    validateUserName,
    validateEmail,
    validatePassword,
    restorePassword,
    updateUserImage,
    setUserData
}

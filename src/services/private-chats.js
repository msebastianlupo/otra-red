import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { formatDate } from './helpers'

// variable que guarda en un objeto los documentos de conversación creados 
let cachedChats = {}

/**
 * mapea los mensajes de chat y los devuelve en un formato más accesible
 * @param {array} messages
 * @returns {array}
 */
function mapMessages(messages){
    const mappedMessages = messages.docs.map(doc => {
        return {
            id: doc.id,
            senderId: doc.data().senderId,
            receiverId: doc.data().receiverId,
            content: doc.data().content,
            created: formatDate(doc.data().created?.toDate())
        }
    })
    return mappedMessages
}

/**
 * genera un id único de documento, en base a los identificadores de dos usuarios
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {string}
 */
function generateChatId(userId1, userId2){
    return [userId1, userId2].sort().join('_')
}

/**
 * genera un documento por conversación privada
 * @param {string} id1 
 * @param {string} id2
 * @returns {Promise<void>}
 * returns
 */
async function generatePrivateChat(identifier, userId1, userId2){
    if(cachedChats[identifier]) return null

    if(!await verifyPrivateChat(identifier)){
        const refChat = doc(db, `private-chats/${identifier}`)
        await setDoc(refChat, {
            users: {
                [userId1]: true,
                [userId2]: true
            }
        })
    }
    cachedChats[identifier] = true
}

/**
 * verifica si un documento de conversación privada existe
 * @param {string} identifier 
 * @returns {boolean}
 */
async function verifyPrivateChat(identifier){
    const refChat = doc(db, `private-chats/${identifier}`)
    const document = await getDoc(refChat)
    return !!document.exists()
}

/**
 * guarda un mensaje
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} message 
 * @return {string}
 */
async function saveMessage(senderId, receiverId, message){
    const privateChatId = generateChatId(senderId, receiverId)
    await generatePrivateChat(privateChatId, senderId, receiverId)

    const refMessages = collection(db, `private-chats/${privateChatId}/messages`)
    const document = await addDoc(refMessages, {
        senderId: senderId,
        receiverId: receiverId,
        content: message,
        created: serverTimestamp()
    })

    return {
        id: document.id
    }
}

async function subscribeToPrivateChat(id1, id2, callback){
    const privateChatId = generateChatId(id1, id2)
    await generatePrivateChat(privateChatId, id1, id2)
    const refMessages = collection(db, `private-chats/${privateChatId}/messages`)
    const q = query(refMessages, orderBy('created'))
    return onSnapshot(q, snapshot => {
        const messages = mapMessages(snapshot)
        callback(messages)
    })
}

/**
 * devuelve todos los comentarios de un chat
 * @param {string} chatId
 * @returns {Promise<array>}
 */
async function getMessages(chatId){
    const refMessages = collection(db, `private-chats/${chatId}/messages`)
    return getDocs(refMessages)
}

/**
 * elimina un mensaje en el chat especificado
 * @param {string} chatId 
 * @param {string} messageId 
 * @returns {Promise<void>}
 */
async function deleteMessage(chatId, messageId){
    const refMessage = doc(db, `private-chats/${chatId}/messages/${messageId}`)
    return deleteDoc(refMessage)
}

/**
 * elimina todos los mensajes de un chat privado y devuelve el total
 * @param {string} chatId
 * @returns {number}
 */
async function deleteAllMessages(chatId){
    const messages = await getMessages(chatId)
    messages.forEach(message => {
        deleteMessage(chatId, message.id)
    })
    return messages.length
}

/**
 * vacía una conversación de chat privado
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {Promise<void>}
 */
async function deleteChat(userId1, userId2){
    const privateChatId = generateChatId(userId1, userId2)
    return deleteAllMessages(privateChatId)
}

export {
    saveMessage,
    subscribeToPrivateChat,
    deleteChat
}
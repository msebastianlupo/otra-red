import { storage } from "./firebase"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { generateRandomString, getFileExtension } from "./helpers"


/**
 * guarda un archivo en el servidor
 * @param {string} path 
 * @param {File} file 
 * @returns {Promise<void>}
 */
async function uploadFile(path, file){
    const extension = getFileExtension(file)
    if(extension){
        const fileName = generateRandomString()
        const filePath = `${path}/${fileName}.${extension}`
        const refFile = ref(storage, filePath)
        const uploadedFile = await uploadBytes(refFile, file)
        return getFileUrl(uploadedFile.metadata.fullPath)
    }
    throw('Extensión de archivo no permitida')
}

/**
 * retorna la ruta de un archivo alojado en el servidor
 * @param {string} path 
 * @returns {Promise<string>}
 */
async function getFileUrl(path){
    const refFile = ref(storage, path)
    return getDownloadURL(refFile)
}

/**
 * elimina un archivo en el servidor
 * @param {string} path 
 * @returns {Promise<void>}
 */
async function removeFile(path){
    const refFile = ref(storage, path)
    return deleteObject(refFile)
}

export {
    uploadFile,
    getFileUrl,
    removeFile
}
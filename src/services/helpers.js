/**
 * devuelve fecha y hora en un formato indicado para el idioma español
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date = ''){
    if(date){
        return Intl.DateTimeFormat('es', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).format(date).replace(',', ' -')
    }
    return date
}

/**
 * devuelve la extensión de un archivo si se encuentra en la lista 
 * @param {File} file 
 * @returns {string|null}
 */
function getFileExtension(file){
    const validExtensions = {
        'image/jpeg': 'jpg',
        'image/pjpeg': 'jpg',
        'image/gif': 'gif',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/avif': 'avif'
    }

    return validExtensions[file.type] || null
}

/**
 * genera una cadena de caracteres aleatorios
 * @returns {string}
 */
function generateRandomString(){
    let random = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    for (let i = 1; i <= 10; i++) {
        let char = Math.floor(Math.random()
            * characters.length + 1)
        random += characters.charAt(char)
    }
    return random;
}

export {
    formatDate,
    getFileExtension,
    generateRandomString
}
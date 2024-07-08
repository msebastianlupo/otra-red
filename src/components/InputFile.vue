<script>
    import { getFileExtension } from '../services/helpers'
    export default {
        name: 'InputFile',
        props: {
            id: {
                type: String,
                default: "file"
            },
            text: {
                type: String,
                default: 'Elegir'
            },
            styles: {
                type: String,
                default: null
            }

        },
        methods: {
            trigger(){
                const element = document.querySelector("#" + this.id)
                element.click()
            },
            handleChange(event){
                if(event.target.files.length){
                    if(getFileExtension(event.target.files[0])){
                        this.$emit('changed', event)
                    }else{
                        this.$emit('invalid', 'Archivo inválido: debe ser jpg, gif, png, webp o avif')
                    }
                }
            }
        }
    }
</script>

<template>
    <div>
        <label class="sr-only" :for="id">Seleccioná una imagen</label>
        <button :class="`mt-3 p-2 px-4 font-medium rounded bg-gray-600 hover:bg-gray-700 hover:transition-all text-white cursor-pointer ${styles}`" type="button" @click.prevent="trigger"><font-awesome-icon icon="image" /> {{text}}</button>
        <input :id="id" class="sr-only" type="file" @change.prevent="handleChange" accept="image/jpeg, image/pjpeg, image/gif, image/png, image/webp, image/avif">
    </div>
</template>
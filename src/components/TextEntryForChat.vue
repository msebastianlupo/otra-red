<script>
    export default {
        name: 'TextEntryForChat',
        props: {
            modelValue: String,
            inactive: false,
            sending: false
        },
        methods: {
            updateValue(event){
                this.$emit('update:modelValue', event.target.value.trim())
            }
        }
}
</script>

<template>
    <div class="fixed left-0 bottom-0 flex justify-center w-full bg-white">
        <div class="flex gap-2 lg:max-w-5xl my-1 p-2 lg:p-0 grow">
            <label class="sr-only" for="message">Mensaje</label>
            <textarea class="grow p-2 border-2 border-gray-200 rounded h-20 outline-0 focus:bg-gray-100 resize-none" :value="modelValue" @input="updateValue($event)" v-bind="$attrs"></textarea>
            <button class="p-2 px-4 font-medium rounded bg-indigo-500 hover:bg-indigo-600 hover:transition-all disabled:bg-indigo-300 text-white" type="submit" :disabled="inactive">{{sending ? 'Enviando' : 'Enviar'}}</button>
        </div>
    </div>
</template>
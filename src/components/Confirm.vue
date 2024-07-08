<script>
    import GenericButton from './GenericButton.vue'
    import Submit from './Submit.vue'
    export default {
        name: 'InputAny',
        components: {GenericButton, Submit},
        props: {
            text: String
        },
        methods: {
            enableAction(){
                this.$emit('enableAction')
            },
            disableAction(){
                this.$emit('disableAction')
            }
        }
}
</script>

<template>
    <form class="fixed top-36 left-[calc(50%-128px)] w-64 p-4 text-center bg-gray-200 rounded shadow-lg z-40" action="#">
        <p class="pb-2 border-b-2 border-gray-300">{{text}}</p>
        <div class="flex gap-1 justify-center">
            <GenericButton bg="bg-gray-700" @click.prevent="disableAction">Cancelar</GenericButton>
            <Submit @click.prevent="enableAction">Aceptar</Submit>
        </div>
    </form>
</template>
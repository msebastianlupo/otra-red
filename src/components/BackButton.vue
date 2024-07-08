<script>
    import Confirm from './Confirm.vue'
    export default {
        name: 'BackButton',
        components: {Confirm},
        props: {
            confirm: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                showDialog: false
            }
        },
        methods: {
            askGoBack(){
                this.showDialog = true
            },
            hideDialog(){
                this.showDialog = false
            },
            goBack(){
                this.$router.go(-1)
            },
            goBackOrAsk(){
                this.confirm ? this.askGoBack() : this.goBack()
            }

        }
    }
</script>

<template>
    <Confirm v-if="showDialog && confirm" @enableAction="goBack" @disableAction="hideDialog" text="No se guardarán los datos" />
    <button class="mt-3 p-2 px-4 font-medium rounded bg-gray-600 hover:bg-gray-700 hover:transition-all text-white" type="button" @click="goBackOrAsk"><font-awesome-icon icon="chevron-left" /> Volver</button>
</template>
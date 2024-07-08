<script>
    import TextEntry from './TextEntry.vue'
    import Submit from './Submit.vue'
    export default {
        name: 'ConfigFormTextEntry',
        components: {TextEntry, Submit},
        props: {
            modelValue: String,
            id: "",
            text: "",
            btn: "",
            loader: false
        },
        methods: {
            updateValue(event){
                this.$emit('update:modelValue', event.target.value.trim())
            }
        }
}
</script>

<template>
    <form class="mb-6" action="#">
        <fieldset class="flex flex-col" :disabled="loader">
            <label :for="id">{{text}}</label>
            <TextEntry :id="id" :value="modelValue" @input="updateValue($event)" />
            <div class="block">
                <Submit>{{btn}}</Submit>
            </div>
        </fieldset>
    </form>
</template>
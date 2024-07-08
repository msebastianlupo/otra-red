<script>
    import InputAny from './InputAny.vue'
    import Submit from './Submit.vue'
    export default {
        name: 'ConfigFormText',
        components: {InputAny, Submit},
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
            <InputAny type="text" :id="id" :value="modelValue" @input="updateValue($event)" />
            <div class="block">
                <Submit>{{btn}}</Submit>
            </div>
        </fieldset>
    </form>
</template>
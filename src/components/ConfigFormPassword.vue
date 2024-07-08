<script>
    import InputAny from './InputAny.vue'
    import Submit from './Submit.vue'
    export default {
        name: 'ConfigFormPassword',
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
            <InputAny type="password" :id="id" :value="modelValue" @input="updateValue($event)" />
            <div class="block">
                <Submit :inactive="modelValue.length < 8">{{btn}}</Submit>
            </div>
        </fieldset>
    </form>
</template>
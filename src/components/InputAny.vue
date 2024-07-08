<script>
    export default {
        name: 'InputAny',
        props: {
            modelValue: String
        },
        methods: {
            updateValue(event){
                this.$emit('update:modelValue', event.target.value)
            }
        }
}
</script>

<template>
    <input class="mt-1 p-2 border-2 border-gray-200 rounded outline-0 focus:bg-gray-100" :value="modelValue" @input="updateValue($event)" v-bind="$attrs">
</template>
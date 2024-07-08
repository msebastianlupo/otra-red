<script>
    import BasicLink from './BasicLink.vue'
    import ProfileImage from './ProfileImage.vue'
    export default {
        name: 'StatusCard',
        components: {BasicLink, ProfileImage},
        props: {
            user: Object,
            to: "",
            title: "",
            status: ""
        }
    }
</script>

<template>
    <div class="flex font-medium text-md gap-3 items-center">
        <BasicLink to="/perfil" title="title">
            <ProfileImage :image="user.image" styles="w-12 md:w-16" />
        </BasicLink>
        <div>
            <div>
                <BasicLink :to="to" title="title">{{user.userName}}</BasicLink>
                <p class="mt-1 text-xs font-medium">{{status}}</p>
            </div>
        </div>
    </div>    
</template>
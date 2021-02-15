<template>
    <div class="mt-3">
        <div class="text-center" v-if="user">
            Welcome back <span class="font-weight-bold text-info">{{ user.displayName }}</span
            >, <a href="#" role="button" class="text-primary" @click="$emit('logout')">logout</a>
        </div>
        <div class="container text-center">
            <div class="row justify-content-center">
                <div class="col-10 col-md-10 col-lg-8 col-xl-7">
                    <h4 class="display-4 text-primary mb-2">Vue-WebRTC Video Chat</h4>
                    <h4 class="display-4 text-primary mb-3">Inspired by Géza</h4>
                    <img src="@/assets/geza_head.png" />
                    <p class="lead">Firebase+Vue+Bootstrap+WebRTC</p>
                    <router-link class="btn btn-outline-primary mr-2" to="/login" v-if="!user">Log In</router-link>
                    <router-link class="btn btn-outline-primary mr-2" to="/register" v-if="!user">Register</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    props: ['user']
};
</script>

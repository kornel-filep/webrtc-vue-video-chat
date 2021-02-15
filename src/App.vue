<template>
    <div id="app">
        <Navigation :user="user" @logout="logout" />
        <router-view :user="user" @logout="logout" />
    </div>
</template>

<script>
import Navigation from '@/components/Navigation';
//import db from './db';
import Firebase from 'firebase';

export default {
    name: 'App',
    data: () => {
        return {
            user: null
        };
    },
    mounted() {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user;
            }
        });
    },
    methods: {
        logout: function() {
            Firebase.auth()
                .signOut()
                .then(() => {
                    this.user = null;
                    this.$router.push('login');
                });
        }
    },
    components: {
        Navigation
    }
};
</script>

<style lang="scss">
$primary: #22a85a;
@import 'node_modules/bootstrap/scss/bootstrap';
</style>

<template>
    <div id="app">
        <Navigation :user="user" @logout="logout" />
        <router-view :user="user" @logout="logout" :rooms="rooms" @addRoom="addRoom" @deleteRoom="deleteRoom" @checkIn="checkIn" />
    </div>
</template>

<script>
import Navigation from '@/components/Navigation';
import db from './db';
import Firebase from 'firebase';

export default {
    name: 'App',
    data: () => {
        return {
            user: null,
            rooms: []
        };
    },
    mounted() {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user;
                db.collection('users')
                    .doc(this.user.uid)
                    .collection('rooms')
                    .onSnapshot(snapshot => {
                        const snapData = [];
                        snapshot.forEach(doc => {
                            snapData.push({
                                id: doc.id,
                                name: doc.data().name
                            });
                        });
                        this.rooms = snapData.sort((a, b) => {
                            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                                return -1;
                            } else {
                                return 1;
                            }
                        });
                    });
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
        },
        addRoom: function(payload) {
            db.collection('users')
                .doc(this.user.uid)
                .collection('rooms')
                .add({
                    name: payload,
                    createdAt: Firebase.firestore.FieldValue.serverTimestamp()
                });
        },
        deleteRoom: function(payload) {
            db.collection('users')
                .doc(this.user.uid)
                .collection('rooms')
                .doc(payload)
                .delete();
        },
        checkIn: function(payload) {
            const roomRef = db
                .collection('users')
                .doc(payload.hostID)
                .collection('rooms')
                .doc(payload.roomID);
            roomRef.get().then(doc => {
                if (doc.exists) {
                    roomRef
                        .collection('attendees')
                        .doc(this.user.uid)
                        .set({
                            displayName: payload.displayName,
                            createdAt: Firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => this.$router.push(`/chat/${payload.hostID}/${payload.roomID}`));
                }
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

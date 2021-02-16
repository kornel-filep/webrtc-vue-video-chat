<template>
    <div class="container-fluid mt-4">
        <div class="mb-3">
            <span class="mb-0 h2 text-primary">{{ roomName }}</span>
            <span class="ml-1">
                Hosted by: <strong class="text-danger">{{ hostDisplayName }}</strong>
            </span>
        </div>
        <div class="row" v-if="user !== null && user.uid === hostID">
            <div class="col-md-8"></div>
            <div class="col-md-4">
                <button class="btn btn-primary mr-1">Join</button>
                <button type="button" class="btn btn-danger mr-1">Leave</button>
                <h4 class="mt-2">Attendees</h4>
                <ul class="list-unstyled">
                    <li>
                        <span class="mr-2" title="On Air">
                            <font-awesome-icon icon="podcast"></font-awesome-icon>
                        </span>
                        <span></span>
                        <span class="pl-1"></span>
                    </li>
                </ul>
                <div>
                    <h5 class="mt-4">Pending</h5>
                    <ul class="list-unstyled">
                        <li class="mb-1" v-for="attendee in attendeesPending" :key="attendee.id">
                            <span>
                                <a type="button" class="mr-2" title="Approve attendee">
                                    <font-awesome-icon icon="user"></font-awesome-icon>
                                </a>
                                <a type="button" class="text-secondary pr-1" title="Delete Attendee" @click="deleteAttendee(attendee.id)">
                                    <font-awesome-icon icon="trash"></font-awesome-icon>
                                </a>
                            </span>
                            <span class="pl-1">{{ attendee.displayName }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="lead">
                Hi <strong class="text-primary font-weight-bold"></strong>, you're currently in the room waiting for the owner of the chat to add you to the
                meeting. Please wait.
            </p>
        </div>
    </div>
</template>
<script>
import db from '../db';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
    name: 'Attendees',
    data: function() {
        return {
            attendeesPending: [],
            hostID: this.$route.params.hostID,
            roomID: this.$route.params.roomID,
            roomName: null,
            hostDisplayName: null
        };
    },
    components: {
        FontAwesomeIcon
    },
    methods: {
        deleteAttendee: function(attendeeID) {
            if (this.user && this.user.uid == this.hostID) {
                db.collection('users')
                    .doc(this.user.uid)
                    .collection('rooms')
                    .doc(this.roomID)
                    .collection('attendees')
                    .doc(attendeeID)
                    .delete();
            }
        }
    },
    props: ['user'],
    mounted() {
        const roomRef = db
            .collection('users')
            .doc(this.hostID)
            .collection('rooms')
            .doc(this.roomID);
        roomRef.get().then(roomDoc => {
            if (roomDoc.exists) {
                this.roomName = roomDoc.data().name;
            } else {
                this.$router.replace('/');
            }
        });
        roomRef.collection('attendees').onSnapshot(attendeeSnapshot => {
            const pendingUsers = [];
            let checkedIn = false;
            attendeeSnapshot.forEach(attendeeDoc => {
                if (this.user.uid === attendeeDoc.id) {
                    checkedIn = true;
                }
                if (this.hostID === attendeeDoc.id) {
                    this.hostDisplayName = attendeeDoc.data().displayName;
                }
                pendingUsers.push({
                    id: attendeeDoc.id,
                    displayName: attendeeDoc.data().displayName
                });
            });
            this.attendeesPending = pendingUsers;
            if (!checkedIn) {
                this.$router.push(`/checkin/${this.hostID}/${this.roomID}`);
            }
        });
    }
};
</script>

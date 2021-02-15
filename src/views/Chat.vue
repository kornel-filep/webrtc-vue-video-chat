<template>
    <div class="container-fluid mt-4">
        <div class="mb-3">
            <span class="mb-0 h2 text-primary">{{ roomName }}</span>
            <span class="ml-1">
                Hosted by: <strong class="text-danger">{{ hostDisplayName }}</strong>
            </span>
        </div>
        <div class="row">
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
                        <li class="mb-1">
                            <span>
                                <a type="button" class="mr-2" title="Approve attendee">
                                    <font-awesome-icon icon="user"></font-awesome-icon>
                                </a>
                                <a type="button" class="text-secondary pr-1" title="Delete Attendee">
                                    <font-awesome-icon icon="trash"></font-awesome-icon>
                                </a>
                            </span>
                            <span class="pl-1">name</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
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
    data: function () {
        return {
            hostID: this.$route.params.hostID,
            roomID: this.$route.params.roomID,
            roomName: null,
            hostDisplayName: null
        };
    },
    components: {
        FontAwesomeIcon
    },
    props: ['user'],
    mounted() {
        const roomRef = db.collection('users').doc(this.hostID).collection('rooms').doc(this.roomID);
        roomRef.get().then(roomDoc => {
            if (roomDoc.exists) {
                this.roomName = roomDoc.data().name;
            } else {
                this.$router.replace('/');
            }
        });
        roomRef.collection('attendees').onSnapshot(attendeeSnapshot => {
            let checkedIn = false;
            attendeeSnapshot.forEach(attendeeDoc => {
                if (this.user.uid === attendeeDoc.id) {
                    checkedIn = true;
                }
                if (this.hostID === attendeeDoc.id) {
                    this.hostDisplayName = attendeeDoc.data().displayName;
                }
            });

            if (!checkedIn) {
                this.$router.push(`/checkin/${this.hostID}/${this.roomID}`);
            }
        });
    }
};
</script>
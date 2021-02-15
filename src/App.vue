<template>
    <div id="app">
        <Navigation />
        <router-view />
    </div>
</template>

<script>
import Navigation from '@/components/Navigation';
export default {
    components: {
        Navigation
    }
};
</script>

<style lang="scss">
$primary: #22a85a;
@import 'node_modules/bootstrap/scss/bootstrap';
</style>

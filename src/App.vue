<template>
  <div id="app">
    <notifications></notifications>
    <router-view/>
  </div>
</template>
<script>

export default {
    mounted() {
        const api = process.env.VUE_APP_API_URL || 'http://localhost:3000'
        this.$store.commit('setUrl', api);
    }
}
</script>

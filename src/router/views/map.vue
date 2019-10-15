<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'
import OpenStreetMap from '@components/OpenStreetMap.vue'

export default {
  page: {
    title: 'Map',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { OpenStreetMap },
}
</script>

<template>
  <OpenStreetMap></OpenStreetMap>
</template>

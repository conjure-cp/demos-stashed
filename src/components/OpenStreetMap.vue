<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator'

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

@Component({
  name: 'OpenStreetMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
})
export default class OpenStreetMap extends Mixins(LMap) {
  @Prop() private location!: string

  zoom: number = 3

  center: [number, number] = [0, 0]

  url: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
}
</script>

<template>
  <l-map
    ref="myMap"
    style=" width: 100%;height: 80%"
    :zoom="zoom"
    :center="center"
  >
    <l-tile-layer :url="url"></l-tile-layer>
  </l-map>
</template>

<style lang="scss" module>
@import '@design';
</style>

<script lang="tsx">
// Allows stubbing BaseLink in unit tests
const BaseLink = 'BaseLink'

export default {
  functional: true,
  props: {
    routes: {
      type: Array,
      required: true,
    },
  },
  render(h, { props, $style }: { props: any, $style: any}) {
    const getRouteTitle = (route) => typeof route.title === 'function' ? route.title() : route.title

    return props.routes.map((route) => (
      <BaseLink
        tag="li"
        key={route.name}
        to={route}
        exact-active-class={$style.active}
      >
        <a>{getRouteTitle(route)}</a>
      </BaseLink>
    ))
  },
}
</script>

<style lang="scss" module>
@import '@design';

.active a {
  font-weight: 600;
  color: $color-link-text-active;
  text-decoration: none;
  cursor: default;
}
</style>

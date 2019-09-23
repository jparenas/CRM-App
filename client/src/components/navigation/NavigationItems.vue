<template>
  <v-list dense nav>
    <v-list-item
      v-for="route in routes"
      v-bind:key="route.path"
      link
      v-bind:to="route.path"
    >
      <v-list-item-icon>
        <v-icon>{{ route.meta.navigation.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ route.meta.navigation.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { routes } from "@/router/router";

@Component
export default class NavigationItems extends Vue {
  public routes = routes.filter(route => route.meta && route.meta.navigation);
}
</script>

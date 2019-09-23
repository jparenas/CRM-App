<template>
  <v-app v-if="loaded">
    <v-navigation-drawer
      app
      width="200"
      :mini-variant="mini"
      permanent
      clipped
      v-if="showNavigation()"
    >
      <NavigationItems />
      <template v-slot:append>
        <v-list dense class="py-0">
          <v-list-item @click.stop="mini = !mini">
            <v-list-item-action>
              <v-icon>{{ navigationArrow() }}</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-icon>
              <v-icon>mdi-settings</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item class="error" @click.stop="logOut">
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app elevate-on-scroll dark clipped-left v-if="showNavigation()">
      <v-toolbar-title>App</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavigationItems from "@/components/navigation/NavigationItems.vue";

@Component({ components: { NavigationItems } })
export default class App extends Vue {
  loaded: boolean = false;
  mini: boolean = true;

  showNavigation(): boolean {
    return this.loaded && !this.$router.currentRoute.meta.hideNavigation;
  }

  loggedIn(): boolean {
    return this.loaded && !!this.$cookies.get("jwt");
  }

  navigationArrow(): string {
    return this.mini ? "mdi-chevron-right" : "mdi-chevron-left";
  }

  public async mounted() {
    this.$cookies.config("0");

    this.$router.beforeEach((to, from, next) => {
      if (to.meta.notAuthenticated || this.$cookies.get("jwt")) {
        next();
      } else {
        if (from.path.match(/^\/login.*/)) {
          this.$router.push("/login");
        }
      }
    });

    if (
      !this.$router.currentRoute.meta.notAuthenticated &&
      !this.$cookies.get("jwt")
    ) {
      if (this.$router.currentRoute.path.match(/^\/login.*/)) {
        await this.$router.push("/login");
      }
    }

    this.loaded = true;
  }

  public logOut() {
    if (this.loggedIn) {
      this.$cookies.remove("jwt");
      if (this.$router.currentRoute.path != "/login") {
        this.$router.push("/login");
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#nav {
  padding: 30px;
  a {
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

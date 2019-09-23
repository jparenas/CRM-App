import Vue from "vue";
import Router from "vue-router";
import VueCookies from "vue-cookies";

Vue.use(Router);

export const routes = [
  { path: "/", redirect: { name: "dashboard" } },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
    meta: {
      navigation: {
        name: "Dashboard",
        icon: "mdi-view-dashboard"
      }
    }
  },
  {
    path: "/contacts",
    name: "contacts",
    component: () =>
      import(/* webpackChunkName: "contacts" */ "../views/Contacts.vue"),
    meta: {
      navigation: {
        name: "Contacts",
        icon: "mdi-account"
      }
    }
  },
  {
    path: "/projects",
    name: "projects",
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/Projects.vue"),
    meta: {
      navigation: {
        name: "Projects",
        icon: "mdi-cogs"
      }
    }
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      navigation: {
        name: "About",
        icon: "mdi-information"
      }
    }
  },
  {
    path: "/settings",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
    meta: {}
  },
  {
    path: "/login*",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: {
      notAuthenticated: true,
      hideNavigation: true
    }
  }
];

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

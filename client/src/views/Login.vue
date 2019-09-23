<template>
  <div class="login">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" v-bind:loading="loading">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-form v-on:submit.prevent="submit">
            <v-card-text>
              <v-alert
                v-model="error"
                border="left"
                close-text="Close Alert"
                dismissible
                transition="slide-y-transition"
                type="error"
                >{{ errorText }}</v-alert
              >
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="text"
                v-model="email"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn type="submit" color="primary">Login</v-btn>
              <div class="flex-grow-1"></div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { axios } from "@/service/axios";

@Component({})
export default class Login extends Vue {
  public email: string = "";
  public password: string = "";
  public loading: boolean = false;

  public error: boolean = false;
  public errorText: string = "";

  public mounted() {
    if (this.$cookies.get("jwt")) {
      this.$router.push("/dashboard");
    }
  }

  public async submit() {
    console.log(this.email);
    try {
      this.error = false;
      this.loading = true;
      var response = await axios.post("/auth/login", {
        email: this.email,
        password: this.password
      });
      if (response.data.error) {
        this.error = true;
        this.errorText = response.data.error;
      } else if (!response.data.successful) {
        this.error = true;
        this.errorText = "No response from the server";
      } else {
        if (!this.$cookies.get("jwt")) {
          this.error = true;
          this.errorText = "Error retrieving the session";
        }
        if (response.data.url) {
          this.$router.push(response.data.url);
        } else {
          var routeMatch = this.$route.path.match(/^\/login(\/.*)/);
          if (routeMatch != null && routeMatch.length > 1) {
            if (this.$router.resolve(routeMatch[1]).route.matched.length > 0) {
              this.$router.push(routeMatch[1]);
            } else {
              window.location.pathname = routeMatch[1];
            }
          } else {
            this.$router.push("/dashboard");
          }
        }
      }
    } catch (err) {
      this.error = true;
      this.errorText = err.message;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped></style>

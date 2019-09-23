<template>
  <div class="dashboard">
    <v-row>
      <v-col cols="4">
        <RecentProjectsWidget />
      </v-col>
      <v-col cols="4">
        <RecentContactsWidget />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RecentProjectsWidget from "@/components/widgets/RecentProjectsWidget.vue";
import RecentContactsWidget from "@/components/widgets/RecentContactsWidget.vue";

@Component({
  components: {
    RecentProjectsWidget,
    RecentContactsWidget
  }
})
export default class Dashboard extends Vue {}
</script>

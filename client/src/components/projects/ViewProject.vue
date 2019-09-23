<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <span class="headline">Project</span>
    </v-card-title>

    <v-card-text>
      <v-container v-if="project">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :value="project.name"
              readonly
              hide-details
              outlined
              label="Project Name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="project.contact || project.stage">
          <v-col cols="7" v-if="project.contact">
            <v-text-field
              :value="project.contact.full_name"
              readonly
              hide-details
              outlined
              label="Contact Name"
            ></v-text-field>
          </v-col>
          <v-col cols="5" v-if="project.stage">
            <v-text-field
              :value="project.stage.name"
              readonly
              hide-details
              outlined
              label="Stage Name"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn color="error" text @click="edit">Edit</v-btn>
      <v-btn color="blue darken-1" text @click="close">Close</v-btn>
    </v-card-actions>

    <v-dialog v-model="showItemEditDialog" persistent max-width="600px">
      <EditProjectForm
        v-if="showItemEditDialog"
        :itemId="itemId"
        v-on:done="handleEdit"
      />
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import gql from "graphql-tag";
import { Component, Vue, Prop } from "vue-property-decorator";
import { routes } from "@/router/router";
import { Project } from "@c/types/project";

@Component({
  components: {
    EditProjectForm: () => import("./EditProjectForm.vue")
  }
})
export default class ViewProject extends Vue {
  @Prop() readonly itemId!: string;

  public project: Partial<Project> = {};

  public isLoading: boolean = false;

  public itemToEdit: string = "";
  public showItemEditDialog: boolean = false;

  public async created() {
    if (parseInt(this.itemId) > -1) {
      this.isLoading = true;
      await this.loadProject();
      this.isLoading = false;
    }
  }

  public edit() {
    this.showItemEditDialog = true;
  }

  public async handleEdit(cancel: boolean) {
    if (!cancel) {
      await this.loadProject();
    }
    this.showItemEditDialog = false;
  }

  public close() {
    this.done();
  }

  private async loadProject() {
    this.project = (await this.$apollo.query({
      query: gql`
        query GetProject($id: ID!) {
          project(id: $id) {
            id
            name
            contact {
              id
              full_name
            }
            stage {
              name
            }
          }
        }
      `,
      variables: {
        id: this.itemId
      }
    })).data.project;
  }

  private done() {
    this.$emit("done");
  }
}
</script>

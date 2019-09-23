<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.name"
              @input="$v.editedItem.name.$touch()"
              @blur="$v.editedItem.name.$touch()"
              :error-messages="nameErrors"
              label="Project Name"
              autofocus
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="editedItem.contact.id"
              clearable
              hint="Contact"
              persistent-hint
              :items="contacts"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="editedItem.stage.id"
              clearable
              hint="Stage"
              persistent-hint
              :items="stages"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn color="error" text @click="cancel">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid"
        >Save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import gql from "graphql-tag";
import { Component, Vue, Prop } from "vue-property-decorator";
import { routes } from "@/router/router";
import { Project } from "@c/types/project";
import { Contact } from "@c/types/contact";
import { Stage } from "@c/types/stage";
import { required, email } from "vuelidate/lib/validators";

@Component({
  validations: {
    editedItem: {
      name: { required }
    }
  }
})
export default class EditProjectForm extends Vue {
  @Prop() readonly itemId!: string;

  public editedItem: Project = {
    id: "-1",
    contact: { id: "-1" },
    stage: { id: "-1", name: "" }
  };

  public isNewItem: boolean = true;

  public title: string = "Project";

  public isLoading: boolean = false;

  public contacts: Contact[] = [];
  public stages: Stage[] = [];

  public async created() {
    this.isLoading = true;
    if (parseInt(this.itemId) > -1) {
      this.editedItem = (await this.$apollo.query({
        query: gql`
          query GetProject($id: ID!) {
            project(id: $id) {
              name
              contact {
                id
                full_name
              }
              stage {
                id
                name
              }
            }
          }
        `,
        variables: {
          id: this.itemId
        }
      })).data.project;
      this.isNewItem = false;
      this.title = "Edit " + this.title;
      if (!this.editedItem.stage) {
        this.editedItem.stage = { id: "-1", name: "" };
      }
      if (!this.editedItem.contact) {
        this.editedItem.contact = { id: "-1" };
      }
    } else {
      this.title = "New " + this.title;
    }
    this.contacts = (await this.$apollo.query({
      query: gql`
        query {
          contacts {
            contacts {
              id
              full_name
            }
          }
        }
      `
    })).data.contacts.contacts.map((contact: Contact) => ({
      text: contact.full_name,
      value: contact.id
    }));
    this.stages = (await this.$apollo.query({
      query: gql`
        query {
          stages {
            stages {
              id
              name
            }
          }
        }
      `
    })).data.stages.stages.map((stage: Stage) => ({
      text: stage.name,
      value: stage.id
    }));
    this.isLoading = false;
  }

  public async save() {
    this.isLoading = true;

    var projectToSave = Object.assign({}, this.editedItem);
    if (projectToSave.id) {
      delete projectToSave.id;
    }
    if ((projectToSave as any).__typename) {
      delete (projectToSave as any).__typename;
    }
    (projectToSave as any).contact_id =
      projectToSave.contact && projectToSave.contact.id !== "-1"
        ? projectToSave.contact.id
        : null;
    (projectToSave as any).stage_id =
      projectToSave.stage && projectToSave.stage.id !== "-1"
        ? projectToSave.stage.id
        : null;
    if (projectToSave.contact) {
      delete projectToSave.contact;
    }
    if (projectToSave.stage) {
      delete projectToSave.stage;
    }
    if (this.isNewItem) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation CreateProject($project: ProjectInput!) {
            createProject(input: $project) {
              id
            }
          }
        `,
        variables: {
          project: projectToSave
        }
      });
    } else {
      await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProject($id: ID!, $project: ProjectInput!) {
            updateProject(id: $id, input: $project) {
              id
            }
          }
        `,
        variables: {
          id: this.itemId,
          project: projectToSave
        }
      });
    }
    this.isLoading = false;
    this.done(false);
  }

  public cancel() {
    this.done(true);
  }

  public get nameErrors() {
    const errors: string[] = [];
    if (!this.$v.editedItem!.name!.$dirty) return errors;
    !this.$v.editedItem!.name!.required &&
      errors.push("First name is required.");
    return errors;
  }

  private done(canceled: boolean) {
    this.$emit("done", canceled);
  }
}
</script>

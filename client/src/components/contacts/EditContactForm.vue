<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="editedItem.first_name"
              @input="$v.editedItem.first_name.$touch()"
              @blur="$v.editedItem.first_name.$touch()"
              :error-messages="firstNameErrors"
              label="First Name"
              autofocus
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="editedItem.last_name"
              @input="$v.editedItem.last_name.$touch()"
              @blur="$v.editedItem.last_name.$touch()"
              :error-messages="lastNameErrors"
              label="Last name"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.email"
              @input="$v.editedItem.email.$touch()"
              @blur="$v.editedItem.email.$touch()"
              :error-messages="emailErrors"
              label="Email"
            ></v-text-field>
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
import { Contact } from "@c/types/contact";
import { required, email } from "vuelidate/lib/validators";

@Component({
  validations: {
    editedItem: {
      first_name: { required },
      last_name: { required },
      email: { email }
    }
  }
})
export default class EditContactForm extends Vue {
  @Prop() readonly itemId!: string;

  public editedItem: Contact = { id: "-1" };

  public isNewItem: boolean = true;

  public title: string = "Contact";

  public isLoading: boolean = false;

  public async created() {
    if (parseInt(this.itemId) > -1) {
      this.isLoading = true;
      this.editedItem = (await this.$apollo.query({
        query: gql`
          query GetContact($id: ID!) {
            contact(id: $id) {
              id
              first_name
              last_name
              email
            }
          }
        `,
        variables: {
          id: this.itemId
        }
      })).data.contact;
      this.isNewItem = false;
      this.title = "Edit " + this.title;
      this.isLoading = false;
    } else {
      this.title = "New " + this.title;
    }
  }

  public async save() {
    if (this.editedItem.id) {
      delete this.editedItem.id;
    }
    if ((this.editedItem as any).__typename) {
      delete (this.editedItem as any).__typename;
    }
    this.isLoading = true;
    if (this.isNewItem) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation CreateContact($contact: ContactInput!) {
            createContact(input: $contact) {
              id
            }
          }
        `,
        variables: {
          contact: this.editedItem
        }
      });
    } else {
      await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateContact($id: ID!, $contact: ContactInput!) {
            updateContact(id: $id, input: $contact) {
              id
            }
          }
        `,
        variables: {
          id: this.itemId,
          contact: this.editedItem
        }
      });
    }
    this.isLoading = false;
    this.done(false);
  }

  public cancel() {
    this.done(true);
  }

  public get firstNameErrors() {
    const errors: string[] = [];
    if (!this.$v.editedItem!.first_name!.$dirty) return errors;
    !this.$v.editedItem!.first_name!.required &&
      errors.push("First name is required.");
    return errors;
  }
  public get lastNameErrors() {
    const errors: string[] = [];
    if (!this.$v.editedItem!.last_name!.$dirty) return errors;
    !this.$v.editedItem!.last_name!.required &&
      errors.push("Last name is required.");
    return errors;
  }
  public get emailErrors() {
    const errors: string[] = [];
    if (!this.$v.editedItem!.email!.$dirty) return errors;
    !this.$v.editedItem!.email!.email && errors.push("Must be valid e-mail");
    return errors;
  }

  private done(canceled: boolean) {
    this.$emit("done", canceled);
  }
}
</script>

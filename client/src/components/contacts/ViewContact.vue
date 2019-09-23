<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <span class="headline">Contact</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              :value="contact.first_name"
              readonly
              hide-details
              outlined
              label="First Name"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :value="contact.last_name"
              readonly
              hide-details
              outlined
              label="Last name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="7">
            <v-text-field
              :value="contact.email"
              outlined
              readonly
              hide-details
              label="Email"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field
              :value="formatDate(contact.updated_at)"
              readonly
              outlined
              hide-details
              label="Updated At"
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
      <EditContactForm
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
import { Contact } from "@c/types/contact";
import { formatDate } from "@/service/date";

@Component({
  components: {
    EditContactForm: () => import("./EditContactForm.vue")
  }
})
export default class ViewContact extends Vue {
  @Prop() readonly itemId!: string;

  public contact: Contact = { id: "-1" };

  public isLoading: boolean = false;

  public itemToEdit: string = this.contact.id;
  public showItemEditDialog: boolean = false;

  public async created() {
    if (parseInt(this.itemId) > -1) {
      this.isLoading = true;
      await this.loadContact();
      this.isLoading = false;
    }
  }

  public edit() {
    this.showItemEditDialog = true;
  }

  public async handleEdit(cancel: boolean) {
    if (!cancel) {
      await this.loadContact();
    }
    this.showItemEditDialog = false;
  }

  public close() {
    this.done();
  }

  public formatDate(date: string) {
    return formatDate(date);
  }

  private async loadContact() {
    this.contact = (await this.$apollo.query({
      query: gql`
        query GetContact($id: ID!) {
          contact(id: $id) {
            id
            first_name
            last_name
            email
            updated_at
          }
        }
      `,
      variables: {
        id: this.itemId
      }
    })).data.contact;
  }

  private done() {
    this.$emit("done");
  }
}
</script>

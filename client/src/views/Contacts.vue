<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout align-center>
          <span>Contacts</span>
          <div class="flex-grow-1"></div>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            class="pt-0 mt-0 mr-2"
          ></v-text-field>
          <v-btn color="primary" v-on:click.stop="newItem">New Item</v-btn>
          <v-dialog v-model="showItemEditDialog" persistent max-width="600px">
            <EditContactForm
              v-if="showItemEditDialog"
              :itemId="itemId"
              v-on:done="handleForm"
            />
          </v-dialog>
          <v-dialog v-model="showItemDialog" max-width="600px">
            <ViewContact
              v-if="showItemDialog"
              :itemId="itemId"
              v-on:done="handleExitView"
            />
          </v-dialog>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="contacts"
        :items-per-page="pageSize"
        :sort-by="sortBy"
        :sort-desc="descending"
        :loading="$apollo.loading"
        :server-items-length="totalContacts"
        :options.sync="options"
        @click:row="rowClicked"
      >
        <template v-slot:item.action="{ item }">
          <v-btn text icon @click.stop="editItem(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
          <v-btn text icon @click.stop="deleteItem(item)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.updated_at="{ item }">
          <span>{{ formatDate(item.updated_at) }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import gql from "graphql-tag";
import debounce from "lodash/debounce";
import { formatDate } from "@/service/date";

import { Contact } from "@c/types/contact";
import { PaginationSortItem } from "@c/types/common";

@Component({
  components: {
    ViewContact: () => import("@/components/contacts/ViewContact.vue"),
    EditContactForm: () => import("@/components/contacts/EditContactForm.vue")
  },
  apollo: {
    contacts: {
      query: gql`
        query GetContacts(
          $pageSize: Int!
          $offset: Int!
          $sort: [SortInputType]!
          $filter: String!
        ) {
          contacts(filter: $filter) {
            contacts(first: $pageSize, after: $offset, sort: $sort) {
              id
              email
              full_name
              updated_at
            }
          }
        }
      `,
      variables() {
        return {
          filter: (this as any).search,
          pageSize: (this as any).pageSize,
          offset: (this as any).pageSize * ((this as any).page - 1),
          sort: (this as any).sortBy.map(
            (sort: string, index: number): PaginationSortItem => {
              return {
                sortBy: sort,
                descending: (this as any).descending[index]
              };
            }
          )
        };
      },
      update: (data: any) => data.contacts.contacts
    },
    totalContacts: {
      query: gql`
        query GetContactsTotalCount($filter: String!) {
          contacts(filter: $filter) {
            totalCount
          }
        }
      `,
      update: (data: any) => data.contacts.totalCount,
      variables() {
        return {
          filter: (this as any).search
        };
      }
    }
  }
})
export default class Contacts extends Vue {
  public headers: { [key: string]: any }[] = [
    {
      text: "Name",
      value: "full_name"
    },
    {
      text: "Email",
      value: "email"
    },
    {
      text: "Last Updated",
      value: "updated_at"
    },
    { text: "Actions", value: "action", sortable: false }
  ];
  public pageSize: number = 10;
  public page: number = 1;
  public contacts: { [key: string]: string }[] = [];
  public totalContacts: number = 0;
  public sortBy: string[] = ["updated_at"];
  public descending: boolean[] = [true];
  public options: any = {};

  public search: string = "";

  public showItemEditDialog: boolean = false;

  public showItemDialog: boolean = false;

  public itemId: string = "-1";

  public formatDate(dateInput: string) {
    return formatDate(dateInput);
  }

  public rowClicked(item: Contact) {
    this.itemId = item.id;
    this.showItemDialog = true;
  }

  public async editItem(item: Contact) {
    this.itemId = item.id;
    this.showItemEditDialog = true;
  }

  public async deleteItem(item: Contact) {
    await this.$apollo.mutate({
      mutation: gql`
        mutation deleteContact($contactId: ID!) {
          deleteContact(id: $contactId)
        }
      `,
      variables: {
        contactId: item.id
      }
    });
    await this.$apollo.getClient().resetStore();
    this.refetchTables();
  }

  public newItem() {
    this.itemId = "-1";
    this.showItemEditDialog = true;
  }

  public async handleForm(canceled: boolean) {
    if (!canceled) {
      await this.$apollo.getClient().resetStore();
      this.refetchTables();
    }
    this.showItemEditDialog = false;
  }

  public async handleExitView() {
    await this.$apollo.getClient().resetStore();
    this.refetchTables();
    this.showItemDialog = false;
  }

  @Watch("options")
  private onOptionsChanged(value: any, _: any) {
    this.pageSize = this.options.itemsPerPage;
    this.page = this.options.page;
    this.sortBy = this.options.sortBy;
    this.descending = this.options.sortDesc;
  }

  @Watch("search")
  private onSearchChanged(value: string, _: string) {
    this.refetchTables();
  }

  private refetchTables = () => {
    debounce(() => {
      this.$apollo.queries.contacts.refetch();
      this.$apollo.queries.totalContacts.refetch();
    }, 150);
  };
}
</script>

<style lang="scss" scoped>
::v-deep div.v-data-table__wrapper tr {
  cursor: pointer;
}
</style>

<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout align-center>
          <span>Projects</span>
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
            <EditProjectForm
              v-if="showItemEditDialog"
              :itemId="itemToShow"
              v-on:done="handleForm"
            />
          </v-dialog>
          <v-dialog v-model="showItemDialog" max-width="600px">
            <ViewProject
              v-if="showItemDialog"
              :itemId="itemToShow"
              v-on:done="handleExitView"
            />
          </v-dialog>
          <v-dialog v-model="showContactDialog" max-width="600px">
            <ViewContact
              v-if="showContactDialog"
              :itemId="contactToShow"
              v-on:done="handleContactExitView"
            />
          </v-dialog>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="projects"
        :items-per-page="pageSize"
        :sort-by="sortBy"
        :sort-desc="descending"
        :loading="$apollo.loading"
        :server-items-length="totalProjects"
        :options.sync="options"
        @click:row="rowClicked"
      >
        <template v-slot:item.contact_name="{ item }">
          <a @click.stop="showContact(item.contact.id)" v-if="item.contact">
            <span>{{ item.contact.full_name }}</span>
          </a>
          <span v-if="!item.contact">No contact assigned</span>
        </template>
        <template v-slot:item.stage_name="{ item }">
          <span v-if="item.stage">{{ item.stage.name }}</span>
          <span v-if="!item.stage">No stage assigned</span>
        </template>
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
import { Id, PaginationSortItem } from "@c/types/common";

@Component({
  components: {
    ViewProject: () => import("@/components/projects/ViewProject.vue"),
    EditProjectForm: () => import("@/components/projects/EditProjectForm.vue"),
    ViewContact: () => import("@/components/contacts/ViewContact.vue")
  },
  apollo: {
    projects: {
      query: gql`
        query GetProjects(
          $pageSize: Int!
          $offset: Int!
          $sort: [SortInputType]!
          $filter: String!
        ) {
          projects(filter: $filter) {
            projects(first: $pageSize, after: $offset, sort: $sort) {
              id
              name
              contact {
                id
                full_name
              }
              stage {
                name
              }
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
      update: (data: any) => data.projects.projects
    },
    totalProjects: {
      query: gql`
        query GetProjectsTotalCount($filter: String!) {
          projects(filter: $filter) {
            totalCount
          }
        }
      `,
      update: (data: any) => data.projects.totalCount,
      variables() {
        return {
          filter: (this as any).search
        };
      }
    }
  }
})
export default class Projects extends Vue {
  public headers: { [key: string]: any }[] = [
    {
      text: "Project Name",
      value: "name"
    },
    {
      text: "Contact Name",
      value: "contact_name",
      sortable: false
    },
    {
      text: "Stage Name",
      value: "stage_name",
      sortable: false
    },
    {
      text: "Last Updated",
      value: "updated_at"
    },
    { text: "Actions", value: "action", sortable: false }
  ];
  public pageSize: number = 10;
  public page: number = 1;
  public projects: { [key: string]: string }[] = [];
  public totalProjects: number = 0;
  public sortBy: string[] = ["updated_at"];
  public descending: boolean[] = [true];
  public options: any = {};

  public search: string = "";

  public showItemEditDialog: boolean = false;
  public showItemDialog: boolean = false;
  public itemToShow: string = "-1";

  public showContactDialog: boolean = false;
  public contactToShow: string = "-1";

  public formatDate(dateInput: string) {
    return formatDate(dateInput);
  }

  public async editItem(item: Contact) {
    this.itemToShow = item.id;
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
    this.itemToShow = "-1";
    this.showItemDialog = true;
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

  public async handleContactExitView() {
    await this.$apollo.getClient().resetStore();
    this.refetchTables();
    this.showContactDialog = false;
  }

  public rowClicked(item: Contact) {
    this.itemToShow = item.id;
    this.showItemDialog = true;
  }

  public showContact(id: Id) {
    this.contactToShow = id;
    this.showContactDialog = true;
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

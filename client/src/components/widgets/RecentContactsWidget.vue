<template>
  <div>
    <v-card>
      <v-card-title>
        <span>Recent Contacts</span>
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
      >
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
    contacts: {
      query: gql`
        query GetContacts(
          $pageSize: Int!
          $offset: Int!
          $sort: [SortInputType]!
        ) {
          contacts {
            contacts(first: $pageSize, after: $offset, sort: $sort) {
              full_name
              updated_at
            }
          }
        }
      `,
      variables() {
        return {
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
        query GetContactsTotalCount {
          contacts {
            totalCount
          }
        }
      `,
      update: (data: any) => data.contacts.totalCount
    }
  }
})
export default class RecentContactsWidget extends Vue {
  public headers: { [key: string]: any }[] = [
    {
      text: "Name",
      value: "full_name"
    },
    {
      text: "Last Updated",
      value: "updated_at"
    }
  ];
  public pageSize: number = 5;
  public page: number = 1;
  public contacts: { [key: string]: string }[] = [];
  public totalContacts: number = 0;
  public sortBy: string[] = ["updated_at"];
  public descending: boolean[] = [true];
  public options: any = {};

  public formatDate(dateInput: string) {
    return formatDate(dateInput);
  }

  @Watch("options")
  private onOptionsChanged(value: any, _: any) {
    this.pageSize = this.options.itemsPerPage;
    this.page = this.options.page;
    this.sortBy = this.options.sortBy;
    this.descending = this.options.sortDesc;
  }
}
</script>

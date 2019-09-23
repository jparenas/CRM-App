export const tables = {
  users: "Users",
  contacts: "Contacts",
  projects: "Proyects",
  stages: "Stages",
  roles: "Roles",
  permissions: "Permissions",
  accessType: "AccessType"
};

export function junctionTable(...tables: string[]): string {
  return tables.sort().join("");
}

export function tableField(table: string, field: string): string {
  return table + "." + field;
}

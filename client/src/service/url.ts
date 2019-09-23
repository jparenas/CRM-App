export function getBaseUrl(): string {
  return window.location.protocol + "//" + window.location.host + "/";
}

export function getGraphQlEndpoint(): string {
  return getBaseUrl() + "graphql";
}

import { getBaseUrl, getGraphQlEndpoint } from "../url";

describe(getBaseUrl, () => {
  it("returns the correctly formatted url", () => {
    expect(getBaseUrl()).toEqual("http://localhost/");
  });
});

describe(getGraphQlEndpoint, () => {
  it("returns the correctly GraphQL url", () => {
    expect(getGraphQlEndpoint()).toEqual("http://localhost/graphql");
  });
});

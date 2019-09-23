module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue", "ts", "tsx"],
  moduleDirectories: ["node_modules", "client/src", "server/src"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/src/$1"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/__test__/*.(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  testURL: "http://localhost/",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  }
};

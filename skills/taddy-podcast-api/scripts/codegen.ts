// GraphQL Code Generator config for the Taddy API. Copy to graphql/codegen.ts in the project, next to the
// contents of scripts/graphql/ (fragments/, queries/), copied to graphql/ as a working starter set.
// Run: npx graphql-codegen --config graphql/codegen.ts
// Add to package.json scripts: "graphql-codegen": "graphql-codegen --config graphql/codegen.ts"
//
// The schema comes from live introspection of https://api.taddy.org. Introspection needs no credentials, only
// network access when the codegen runs (in CI too, or commit the generated operations.ts). The generated types
// therefore always match the production API. Requests go to the same endpoint.
// Offline or reproducible builds: copy the skill's references/schema.graphql (podcast-only, pinned to the skill
// release; also at https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql) to graphql/schema.graphql and set
// schema: "graphql/schema.graphql". The live schema also has comic and creator types; operation-scoped plugins only
// emit what the documents use, so that costs nothing.
//
// `documents` lists fragments/ and queries/ explicitly so a local schema file is never parsed as an operation document.
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.taddy.org",
  documents: ["graphql/fragments/**/*.graphql", "graphql/queries/**/*.graphql"],
  generates: {
    "graphql/operations.ts": {
      plugins: ["typescript-operations", "typescript-document-nodes"],
      // Named import of graphql-tag: it types cleanly under "module": "nodenext".
      config: { gqlImport: "graphql-tag#gql" },
    },
  },
};

export default config;

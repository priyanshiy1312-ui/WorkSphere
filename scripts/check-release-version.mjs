import fs from "node:fs";
import process from "node:process";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const tag = process.argv[2] || process.env.GITHUB_REF_NAME;

if (!tag) {
  console.error(
    "Release version validation failed: no release tag provided. Pass a tag or set GITHUB_REF_NAME.",
  );
  process.exit(1);
}

if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(tag)) {
  console.error(
    `Release version validation failed: "${tag}" is not a valid v-prefixed semantic version tag.`,
  );
  process.exit(1);
}

const expectedTag = `v${packageJson.version}`;

if (tag !== expectedTag) {
  console.error(
    `Release version mismatch: Git tag is "${tag}", but package.json version is "${packageJson.version}". Update package.json or create the matching release tag.`,
  );
  process.exit(1);
}

console.log(
  `Release version validated successfully: ${tag} matches package.json.`,
);

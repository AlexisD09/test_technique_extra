const { execSync } = require("child_process");
const path = require("path");

console.log("Comparaison");

const legacyPath = path.resolve(__dirname, "../legacy/orderReportLegacy.js");
const refactoredPath = path.resolve(__dirname, "../src/index.js");

const legacyOutput = execSync(`node "${legacyPath}"`).toString();
const newOutput = execSync(`node "${refactoredPath}"`).toString();

if (legacyOutput === newOutput) {
    console.log("Test OK");
} else {
    console.error("Test KO");
    process.exit(1);
}
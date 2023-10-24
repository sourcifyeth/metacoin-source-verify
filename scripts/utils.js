const fs = require("fs").promises;

const fsAsync = require("fs");
const util = require("util");
const path = require("path");

// Promisify the fs.readdir function
const readdir = util.promisify(fsAsync.readdir);

// Main function
async function getFirstFileInBuildInfo() {
  try {
    // Get the file names in the build-info directory
    const directory = "./artifacts/build-info";
    const files = (await readdir(directory)).filter((f) => f.includes(".json"));

    if (!files.length) {
      console.log("No files found in build-info.");
      return;
    }

    // Get the stats for each file
    const statsPromises = files.map((file) => fs.stat(`${directory}/${file}`));
    const fileStats = await Promise.all(statsPromises);

    // Pair each file name with its modification time
    const fileTimePairs = files.map((file, index) => ({
      file,
      timestamp: fileStats[index].mtime.getTime(),
    }));

    // Sort based on the modification time
    fileTimePairs.sort((a, b) => b.timestamp - a.timestamp);

    // Get the most recent file
    return fileTimePairs[0].file;
  } catch (error) {
    // If there's an error, log it
    console.error(
      `Error getting the first file in build-info: ${error.message}`
    );
  }
}

async function storeAddress(file, chainId, address, buildInfoFilename) {
  let jsonObject = {
    networks: {},
  };

  // If the file exists, use existing file
  try {
    jsonObject = JSON.parse(await fs.readFile(file));
  } catch (e) {}

  try {
    jsonObject.networks[chainId] = {
      address: address,
      buildInfoFilename: buildInfoFilename,
    };

    // Convert JSON object to string
    let data = JSON.stringify(jsonObject, null, 4);

    // Write JSON data to the file
    await fs.writeFile(file, data);

    console.log(`Address stored in the file: ${file}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

module.exports = {
  storeAddress,
  getFirstFileInBuildInfo,
};

getFirstFileInBuildInfo();

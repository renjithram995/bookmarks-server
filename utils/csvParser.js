const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');

const processSmallCSV = (filePath, userId, processData) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        processData(results, userId).then(resolve).catch(reject);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

async function processLargeCSV(filePath, userId, processData) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let succededLines = 0;
  let rejectedLines = 0;
  for await (const line of rl) {
    console.log(line);
    if (lineNumber === 0) {
      console.log('Header:', line); // Log or process the header line
    } else {
      const fields = line.split(',');
      try {
        const { succeeded = 0, rejected = 0 } = await processData([{ repoName: fields[0], repoUrl: fields[1] }], userId);
        succededLines += succeeded;
        rejectedLines += rejected;
      } catch (error) {
        console.log('Error while processing Large CSV', error);
        rejectedLines += 1;
      }
      console.log(`Processing line ${lineNumber}}`);
    }
    lineNumber++;
  }
  console.log(`Finished processing ${lineNumber} lines from large CSV.`);
  return { succeeded: succededLines, rejected: rejectedLines };
}

module.exports = { processSmallCSV, processLargeCSV };

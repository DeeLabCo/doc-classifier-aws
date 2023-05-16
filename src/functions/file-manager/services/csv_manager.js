const fs = require('fs');
const {stringify } = require('csv-stringify');

let saveCsvTmp = (fileName, fileData) => {
  let filePath = "/tmp/" + fileName;
  return new Promise ((resolve, reject) => {
    fs.writeFile(filePath, fileData, (error) => {
      if (error) {
        console.log('Error saving temp file', error);
        reject(null);
      } else {
        resolve(filePath);
      }
    });
  });
};

let genCsvFromRecords = (analysisRecords) => {
  const currentTime = new Date().getTime();
  const fileName = `analysis_records_${currentTime}.csv`;
  let csvInputData = analysisRecords;
  return new Promise((resolve, reject) => {
    stringify(csvInputData, {
      header: false,
      delimiter: ';',
    }, async (error, output) => {
      if (error) {
        console.error("error generating csv", error);
        reject(error);
      }
      await saveCsvTmp(fileName, output);
      resolve(fileName)
    })
  });
};

module.exports = {
  genCsvFromRecords
}
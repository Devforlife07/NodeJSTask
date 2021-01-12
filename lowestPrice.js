const csv = require("csv-parser");
const { convertArrayToCSV } = require("convert-array-to-csv");
const fs = require("fs");
const path = require("path");
let uniqueValues = {};
const lowestPrice = async () => {
  return new Promise(async (resolve, reject) => {
    let filepath = path.join("./output/filteredCountry.csv");
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (row) => {
        if (!uniqueValues[row["SKU"]]) {
          uniqueValues[row["SKU"]] = [
            parseFloat(row["PRICE"].substr(1)),
            parseFloat(row["PRICE"].substr(1)),
          ];
        } else {
          let price = parseFloat(row["PRICE"].substr(1));

          //Updating Minimum And Maximum Values Inside An Object
          if (price < uniqueValues[row["SKU"]][0]) {
            uniqueValues[row["SKU"]][0] = price;
          }
          if (price > uniqueValues[row["SKU"]][1]) {
            uniqueValues[row["SKU"]][1] = price;
          }
        }
      })
      .on("end", () => {
        try {
          let pathtoWrite = path.join("./output", "lowestPrice.csv");

          const header = ["SKU", "FIRST_MINIMUM_PRICE", "SECOND_MINIMUM_PRICE"];
          let output = [];
          for (key in uniqueValues) {
            output.push({
              key,
              FIRST_MINIMUM_PRICE: uniqueValues[key][0],
              SECOND_MINIMUM_PRICE: uniqueValues[key][1],
            });
          }
          const csvFromArrayOfArrays = convertArrayToCSV(output, {
            header,
            separator: ",",
          });
          const streamdata = fs.createWriteStream(pathtoWrite, {
            flags: "w",
          });
          streamdata.write(csvFromArrayOfArrays);
          streamdata.end();
          resolve("Completed Successfully");
        } catch (e) {
          reject(e);
        }
      });
  });
};
module.exports = lowestPrice;

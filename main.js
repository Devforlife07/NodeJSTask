const csv = require("csv-parser");
const { convertArrayToCSV } = require("convert-array-to-csv");
const lowestPrice = require("./lowestPrice");
const fs = require("fs");
let pathtowrite = "./output";
const path = require("path");
const result = [];
function getFilteredData() {
  //READ Main.csv File
  fs.createReadStream("./input/main.csv")
    .pipe(csv())
    .on("data", (row) => {
      //Filtering Data where country includes USA And Storing it in array
      if (row["COUNTRY"].includes("USA")) result.push(row);
    })
    .on("end", () => {
      //Converting result to csv format and writing in file
      const csvFromArrayObjects = convertArrayToCSV(result);
      const streamdata = fs.createWriteStream(
        path.join(pathtowrite, "filteredCountry.csv"),
        {
          flags: "w",
        }
      );
      streamdata.write(csvFromArrayObjects);
      streamdata.end();
      streamdata.on("close", async () => {
        try {
          console.log("Hello");
          const res = await lowestPrice();
          console.log(res);
        } catch (e) {
          console.log(e.message);
        }
      });
    });
}
getFilteredData();

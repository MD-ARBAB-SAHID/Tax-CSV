const fs = require("fs");
const csv = require("csv-parser");
let result = [];



const calculateTax = (amount,itemId)=>{
  switch (itemId) {
    case 0:
      return 0.05 * amount;
      break;
    case 1:
      return 0.08 * amount;
      break;
    case 2:
      return 0.12 * amount;
      break;
    default:
      return null;
  }
};





   


const convertToCsv = (output, finalHeader)=>{
  const header = finalHeader;
  const rows = output.map(
    (row) => `${row["s.no"]}, ${row.amount}, ${row.item_type}, ${row.tax}`
  );
  return header.concat(rows).join("\n");
};

   const writeIntoFile = (output,outputFileName,finalHeader)=>{
      
  fs.writeFile(outputFileName, convertToCsv(output, finalHeader), (err) => {
    if (err) {
      console.log("File not Saved", err);
    } else {
      console.log("File Saved");
    }
  });

    };


   const readData = (inputFileName,outputFileName,finalHeader) => {
      fs.createReadStream(inputFileName)
  .pipe(csv())
  .on("data", function (row) {
    let item_type = row.item_type;
    let amount = row.amount;
 
    let tax =calculateTax(Number(amount), Number(item_type));
    let Details;

    if (tax) {
       Details = {
        "s.no": row["s.no"],
        amount,
        item_type,
        tax,
      };
 
    result.push(Details);
    }
    
  })
  .on("end", function () {

    writeIntoFile(result, outputFileName,finalHeader);
  });
    };

readData("invoice.csv","output.csv",["s.no,amount,item_type,tax"]);



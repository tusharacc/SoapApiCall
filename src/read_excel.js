const XLSX = nodeRequire('xlsx');
const path = nodeRequire('path')

//let wb = XLSX.readFile('POlicyDetails.xlsm');
//policy_json = XLSX.utils.sheet_to_json(wb.Sheets["Sheet1"]);
//console.log(policy_json);
exports.readExcel = (filepath) => {
    let wb = XLSX.readFile(filepath);
    policy_json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    return policy_json;
}

exports.createNewXlsxFile = (filename,data) => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("Template");
    let ws = XLSX.utils.aoa_to_sheet([data]);
    wb.Sheets["Template"] = ws;
    p = './template/'+filename+'.xlsx';
    XLSX.writeFile(wb,p,{bookType:'xlsx',  type: 'binary'});
    console.log('Created Excel');
}


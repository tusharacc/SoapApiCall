const shell = nodeRequire('electron').shell;
const {dialog} = nodeRequire('electron').remote;
const excel = nodeRequire('./read_excel');
const _ = nodeRequire('lodash');
const fl = nodeRequire('./file');
const fs = nodeRequire('fs');
const path = nodeRequire('path');
const soap = nodeRequire('./soap');

let btnConfigure = document.getElementById('btn-configure');
let btnGeneratePayload = document.getElementById('btn-generate-payload');
let btnGetTemplate = document.getElementById('btn-get-template');
let btnGenPayload = document.getElementById('btn-gen-payload');
let btnSelectFile = document.getElementById('btn-select-file');
let btnSelectFolder = document.getElementById('btn-select-folder')

let displayError = (errMsg) => {
    let elem = document.getElementById('alertBox'); 
    elem.style.display = 'inline';
    document.getElementById('message').innerHTML = errMsg;
    setTimeout(() => {
        document.getElementById('message').innerHTML = null
        document.getElementById('alertBox').style.display = 'none';
    },5000)
}

let displayMsg = (msg) => {
    document.getElementById('messagebox').style.display = 'inline';
    document.getElementById('success-msg').innerHTML = msg;
    setTimeout(() => {
        document.getElementById('success-msg').innerHTML = null
        document.getElementById('messagebox').style.display = 'none';
    },5000)
}

btnSelectFile.addEventListener('click',() => {
    dialog.showOpenDialog({
        properties: ['openFile']
    },(file) => {
        let webserviceName = path.parse(file[0])['name'].split('_')[0];
        fl.readjsondocument(webserviceName+'.json').then((data) => {
            let url = data['url'];
            soap.updateBillingAddress(file[0],url).then((data) => {
                if (data){
                    displayError('Processing Failed!!')
                } else {
                    displayMsg('File Processed')
                }
            });
        },(err) => {console.log('Error')})
    });
})


btnSelectFolder.addEventListener('click',() => {
    let result = [];
    dialog.showOpenDialog({
        filters:[{extensions: ['*']}],
        properties: ['openDirectory']
    },(folder) => {
        fs.readdir(folder[0],(err,files) => {
            if (err) throw err;
            files.forEach((file,index) => {
                let webserviceName = path.parse(file)['name'].split('_')[0];
                fl.readjsondocument(webserviceName+'.json').then((data) => {
                    let url = data['url'];
                    soap.updateBillingAddress(path.join(folder[0],file),url).then((data) => {
                        if (data){
                            result.push(true)

                        } else {
                            result.push(false);

                        }
                    });
                },(err) => {})
                if (files.length == index + 1){
                    if (result.every(isTrue)){
                        displayMsg('WebService Call Success for all files');
                    } else{
                        displayError('WebService Call Failed for few/all files');
                    }
                }
            });
        })
    });
})

function isTrue(element){
    return element == true;
}

btnGetTemplate.addEventListener('click',() => {
    let elem = document.getElementById('dropdown-menu-parent');
    p = path.join((path.normalize(__dirname+'\\..')),'template',elem.value.split('.')[0]+'.xlsx');
    shell.openItem(p);
});

btnGenPayload.addEventListener('click',() => {
    let elem = document.getElementById('dropdown-menu-parent');
    let write_result = []
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (file) {
        fl.readjsondocument(elem.value)
        .then(function(result) {
            if (file !== undefined) {
                dt = new Date();
                folder_name = dt.getFullYear() + "_" + dt.getMonth() + "_" + dt.getDate() + "_" + dt.getHours() + "_" + dt.getMinutes() + "_" + dt.getSeconds();
                fs.mkdirSync('./results/'+folder_name);
                excelData = excel.readExcel(file[0]);
                let totalRecords = excelData.length;
                excelData.forEach((record,index) => {
                    let payload = result['payload'];
                    let val = elem.value;
                    for (let key in record){
                        payload = payload.replace('@'+key,record[key]);
                    }
                    filepath = './results/'+folder_name+'/'+ elem.value.split('.')[0] + '_' + index + '.xml'
                    fl.writefile(filepath,payload)
                    .then((result) => {
                        if (result){
                            write_result.push(false);
                        } else {
                            write_result.push(true);
                        }
                        if (index + 1== totalRecords){
                            if (write_result.every(isTrue)){
                                displayMsg('Payload for all records generated');
                            } else{
                                displayError('Payload generation failed for few records failed');
                            }
                        }
                    });    
                })
            }
          }, function(err) {
            console.log(err); // Error: "It broke"
        });
    })
})

btnGeneratePayload.addEventListener('click',() => {
    let elem_dropdown = document.getElementById('dropdown-menu-parent');
    fs.readdir('./api',(err,files) => {
        if (err) throw err;
        files.forEach((file) => {
            let a = document.createElement('option');
            a.setAttribute('class','dropdown-item');
            a.setAttribute('value',file);
            let node = document.createTextNode(file);
            a.appendChild(node);
            elem_dropdown.appendChild(a);
        })
    })
})

btnConfigure.addEventListener('click',() => {
    let url = document.getElementById('api-url');
    let payload = document.getElementById('payload');

    if (url.value == ''){
        displayError('Please enter webservice URL');
    } else if (payload.value == ''){
        displayError('Please enter payload')
    } else {
        let webServiceName = url.value.slice(url.value.lastIndexOf('/')+1);
        let reVariables = /@(.*)\<\//g;
        let stringsFound = payload.value.match(reVariables);
        let stringsFound_sanitised = stringsFound.map(x => x.replace('@','').replace('</',''));
        excel.createNewXlsxFile(webServiceName,stringsFound_sanitised);
        let api_info = {};
        api_info['name'] = webServiceName;
        api_info['payload'] = payload.value.replace('\n','');
        api_info['variables'] = stringsFound_sanitised;
        api_info['url'] = url.value;
        fl.writeApiInformation(api_info,webServiceName);

    }


})


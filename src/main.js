const shell = nodeRequire('electron').shell;
const {dialog} = nodeRequire('electron').remote;
const excel = nodeRequire('./read_excel');
const _ = nodeRequire('lodash');
const fl = nodeRequire('./file');
const fs = nodeRequire('fs');
const path = nodeRequire('path');

let btnConfigure = document.getElementById('btn-configure');
let btnGeneratePayload = document.getElementById('btn-generate-payload');
let btnGetTemplate = document.getElementById('btn-get-template');
let btnGenPayload = document.getElementById('btn-gen-payload');
let btnSelectFile = document.getElementById('btn-select-file');
let btnSelectFolder = document.getElementById('btn-select-folder')

let displayError = (errMsg) => {
    document.getElementById('alertBox').style.display = 'inline'
    document.getElementById('message').innerHTML = errMsg
    setTimeout(() => {
        $("#alertBox").alert('close');
    },5000)
}

btnSelectFile.addEventListener('click',() => {
    dialog.showOpenDialog({
        properties: ['openFile']
    },(file) => {
        let webserviceName = file[0].split('_')[0];
        fl.readjsondocument(elem.value+'.json').then((data) => {
            let url = data['url'];
        },(err) => {})
    });
})


btnSelectFolder.addEventListener('click',() => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    },(folder) => {

    });
})


btnGetTemplate.addEventListener('click',() => {
    let elem = document.getElementById('dropdown-menu-parent');
    p = path.join((path.normalize(__dirname+'\\..')),'template',elem.value.split('.')[0]+'.xlsx');
    console.log(p);
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
            console.log(result); // "Stuff worked!"
            if (file !== undefined) {
                dt = new Date();
                folder_name = dt.getYear() + "_" + dt.getMonth() + "_" + dt.getDate() + "_" + dt.getHours() + "_" + dt.getMinutes() + "_" + dt.getSeconds()
                fs.mkdirSync('./results/'+folder_name)
                //console.log(file);
                excelData = excel.readExcel(file[0]);
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
                            write_result.push('Success');
                        } else {
                            write_result.push('Failed')
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


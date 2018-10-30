const fs = nodeRequire('fs');

function message(type,msg){

    if (type == 'err'){
        displayError(msg)
        throw err
    } else {
        document.getElementById('messagebox').style.display = 'inline';
        document.getElementById('success-msg').innerHTML = msg;
        setTimeout(() => {
            $("#messagebox").alert('close');
        },5000)
    }
}

exports.writefile = async (filepth,data) => {
    fs.writeFile(filepath,data,(err) => {
        if (err) return false;
        return true;
    })
}

exports.readjsondocument = async (filename) => {
    p = './api/' + filename;
    return JSON.parse(fs.readFileSync(p))
    
}

exports.writeApiInformation = (json, filename) => {
    s = JSON.stringify(json);
    p = './api/'+filename+'.json';
    fs.writeFile(p,s,(err) => {
        if (err)
        {
            message('err','Error in Configureation')
        } ;
        message('succ','Set Up complete')
        
    });

}
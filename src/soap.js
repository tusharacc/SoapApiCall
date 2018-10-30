const request = nodeRequire('request')
const fs = nodeRequire('fs');
const path = nodeRequire('path');

exports.updateBillingAddress = async (filepath,url) => {
    let xml = fs.readFileSync(filepath);

    const opts = {
        body: xml,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'AssociatePolicyTerm'
        }
    }
    let fileDetails = path.parse(filepath);
    //err = false
    //const url = `http://EIDirBilAcctAssocCRM19X1s/CRM5ServicesWeb/sca/DirectBillAccountAssociationCRM19X1Http`
    const body = request.post(url, opts, (err, response) => {
        if (err) {
            fs.renameSync(filepath,path.join(fileDetails['dir'],fileDetails['name'] + '_Err' + '.xml'));
            return false;
        } else {
            fs.renameSync(filepath,path.join(fileDetails['dir'],fileDetails['name'] +'_Processed' + '.xml'));
            return true;
        }
    })
}
    
const request = require('request')

const xml = '<yourxml>'
const opts = {
    body: xml,
    headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'AssociatePolicyTerm'
    }
}

//UAT - http://EIDirBilAcctAssocCRM19X1s/CRM5ServicesWeb/sca/DirectBillAccountAssociationCRM19X1Http <http://eidirbilacctassoccrm19x1s/CRM5ServicesWeb/sca/DirectBillAccountAssociationCRM19X1Http>  


const url = 'http://eidirbilacctassoccrm19x1p/CRM5ServicesWeb/sca/DirectBillAccountAssociationCRM19X1Http/WEB-INF/wsdl/DirectBillAccountAssociationCRM19X1/DirectBillAccountAssociationCRM19X1Http.wsdl'

const body = request.post(url, opts, (err, response) => {
    console.log('response', response.body)
})
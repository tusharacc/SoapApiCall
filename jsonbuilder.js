let parseString = require('xml2js').parseString;
let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:dir="http://ei/crm/direct_bill_account_association_crm19x1">
<soapenv:Header/>
<soapenv:Body>
    <dir:AssociatePolicyTerm>
        <AssociatePolicyTermRequest>
            <DirectBillAssociationInputs>
                <ControlNumber>13491425</ControlNumber>
                <InceptionDate>2018-11-05</InceptionDate>
                <ExpirationDate>2019-11-05</ExpirationDate>
            </DirectBillAssociationInputs>
            <Insured>
                <MailingAddress>
                    <AddressLine1>145 W PEACE ST</AddressLine1>
                    <CityName>CANTON</CityName>
                    <StateOrProvinceCode>MS</StateOrProvinceCode>
                    <PostalCode>39046</PostalCode>
                    <CountryAbbreviation>USA</CountryAbbreviation>
                </MailingAddress>
                <CPNumber>059012432144</CPNumber>
            </Insured>
            <SystemId>Q2</SystemId>
            <UserId>ITADC1P</UserId>
            <BookingEntryTypeCode>010</BookingEntryTypeCode>
            <PaymentScheduleCode>00</PaymentScheduleCode>
            <PolicyNumber>000064111482</PolicyNumber>
            <ProducerNumber>0026031</ProducerNumber>
            <ProducerSubNumber>99999</ProducerSubNumber>
        </AssociatePolicyTermRequest>
    </dir:AssociatePolicyTerm>
</soapenv:Body>
</soapenv:Envelope>`

parseString(xml, function (err, result) {
    console.dir(result['soapenv:Envelope']['soapenv:Body']);
});
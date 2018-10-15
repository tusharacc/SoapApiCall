import pandas as pd
import re 
with open('cbs.txt','r') as f:
    addresses = f.readlines()
records = list(map(lambda y: [item for item in y if item.strip() != ''],map(lambda x: x.split('\t'),addresses)))
insured_details = []
addr = re.compile('[0-9]+')
for record in records:
    details = {}
    if len(record) == 4:
        details['addressline'] = record[2]
    elif len(record) <= 3:
        print (f'CBS file has 3 component {record}')
        continue
    else:
        #print (f'CBS file has more than 4 component {record}')
        try:
            if addr.match(record[2]) == None:
                details['addressline'] = record[3]
            else:
                details['addressline'] = record[2]
        except Exception as ex:
            print (f'Error in regular expression {record}')

    details['policy'] = record[0].strip()
    details['insured_name'] = record[1].strip()
    try:
        city,state_zip = [x.strip() for x in record[-1].split('      ') if x.strip() != '']
    except Exception as ex:
        print (f'Error while splitting {record}')
    details['city'] = city.strip()
    details['state'] = state_zip[0:2]
    details['zip'] = state_zip[2:]
    insured_details.append(details)


pd.DataFrame(data=insured_details).to_excel('address.xlsx',index=False)
import axios from 'axios';

const settings = window.APP_SETTINGS

// TODO: Handle renewel login here properly.

export const fetchAuths = async () => {
    try
    {
    const url = `${settings.MYO_API_BASE_URL}/authforms`
    const resp = await axios.get(url);
    console.log(resp);
    }
    catch(err) {

    }
    
}


/**
 * Creates an authorization.
 * 
 * postModel has the following structure:
 * {
 *   claimNumber,
 *   rush,
 *   claimant: {
 *     name,
 *     dob,
 *     ssn
 *   },
 *   recordLocation: {
 *     locationId,
 *     allRecords,
 *     toPresent,
 *     fromDate,
 *     toDate.
 *     recordTypeId,
 *     scope
 *   }   
 * }
 */
export const createAuth = (postModel) => {

    const { claimNumber, rush, claimant, recordLocation, allowAddFacilityNamesToHipaaAuth, uploadedFiles } = postModel;

    const url = `${settings.MYO_API_BASE_URL}/cases/authorizations`

    return axios({
        method: 'post',
        url: url,
        data: {
          claimNumber,
          rush,
          claimant,
          recordLocations: [{
            ...recordLocation
          }],
          allowAddFacilityNamesToHipaaAuth,
          uploadedFiles
        }
    });
}

/*** File download functions ***/

export const getDonwloadLink = async (fileId) => {
    const result = await axios.post(`${settings.MYO_API_BASE_URL}/files/sign?fileId=${fileId}`);
    return result.data;
}

/*** End File download functions  ***/

/*** Cases functions ***/
export const fetchCase = async (caseId) => {
    const result = await axios.get(`${settings.MYO_API_BASE_URL}/cases/${caseId}`);
    return result.data;
}

export const fetchMappedCase = async (caseId) => {
    const result = await fetchCase(caseId);

    if(result != null) {
        return {
            orderNumber: result.caseId,
            orderDate: new Date(result.orderDate).toLocaleDateString(),
            patientName: result.patientName,
            patientDob: new Date(result.patientDob).toLocaleDateString(),
            patientSSN: result.patientSsn,
            patientClaimNumber: result.claimNo,
            providerName: result.recordLocations[0].name,
            providerRush: result.rush ? 'Yes' : 'No',
            providerRecordType: result.recordLocations[0].recordType,
            providerDateRange: result.recordLocations[0].dateRange,
            providerScope: result.recordLocations[0].scope,
            providerAddress: result.recordLocations[0].address,
            providerCity: result.recordLocations[0].city,
            providerState: result.recordLocations[0].state,
            providerPostalCode: result.recordLocations[0].zipCode,
            providerPhone: result.recordLocations[0].phone,
            providerFax: result.recordLocations[0].fax,
            orderStatus: result.recordLocations[0].status,
            documents: result.recordLocations[0].files,            
            remarks: result.recordLocations[0].logs
        };
    } else {
        return {
            orderNumber: '',
            orderDate: '',
            patientName: '',
            patientDob: '',
            patientSSN: '',
            patientClaimNumber: '',
            providerName: '',
            providerRush: '',
            providerRecordType: '',
            providerDateRange: '',
            providerScope: '',
            providerAddress: '',
            providerCity: '',
            providerState: '',
            providerPostalCode: '',
            providerPhone: '',
            providerFax: '',
            orderStatus: '',
            documents: []
        };
    }
}
/*** End Cases functions  ***/

/*** States functions ***/
export const fetchStates = async () => {
    const result = await axios.get(`${settings.MYO_API_BASE_URL}/states`);
    return result.data;
}

export const fetchMappedStates = async () => {
    const result = await fetchStates();
    return result.map(state => ({
        value: state.id, 
        label: state.name
    }));
}
/*** End States functions  ***/

/*** Record Type functions ***/
export const fetchRecordTypes = async () => {
    const result = await axios.get(`${settings.MYO_API_BASE_URL}/recordtypes`);
    return result.data;
}

export const fetchMappedRecordTypes = async () => {
    const result = await fetchRecordTypes();
    return result.map(recordType => ({
        value: recordType.id,
        label: recordType.name,
        scopeDetails: recordType.scopeDetails
    }));
}
/*** End Record Type functions  ***/

/*** Location functions ***/
export const createLocation = async (locationModel) => {
    const { locationName, streetAddress, city, state, zip, phone, fax } = locationModel;

    const url = `${settings.MYO_API_BASE_URL}/locations`
    
    return await axios({
        method: 'post',
        url: url,
        data: {
          locationName,
          streetAddress,
          city,
          state,
          zip,
          phone,
          fax
        }
    });
}

/*** Document Type functions ***/
export const fetchDocumentTypes = async () => {
    const result = await axios.get(`${settings.MYO_API_BASE_URL}/documenttypes`);
    return result.data;
}

export const fetchMappedDocumentTypes = async () => {
    const result = await fetchDocumentTypes();
    return result.map(documentType => ({
        value: documentType.id,
        label: documentType.name
    }));
}


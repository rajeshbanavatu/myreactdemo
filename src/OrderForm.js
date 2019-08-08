import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MySelect from './Components/MySelect';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import NumberFormat from 'react-number-format';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { 
  createAuth, 
  createLocation,
  fetchMappedStates, 
  fetchMappedRecordTypes,
  fetchMappedDocumentTypes 
} from './Services/MyoApiService';
import  GuidewireApiService from './Services/GuidewireService';
import { Formik, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { FormikDatePicker } from './Components/FormikDatePicker';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import {green, red} from '@material-ui/core/colors';
import Banner from './Components/Banner';
import CreateLocationModal from './Components/CreateLocationModal';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { getUser } from './Services/AuthService';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

const settings = window.APP_SETTINGS;

const styles = theme => ({
  root: {
    // margin: 10,
    // padding: 10,
    flexGrow: 1    
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  },
  textField: {

  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  appBar: {
    
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
  },
  caseSectionLabel: {
    paddingTop: theme.spacing.unit * 2,
    fontWeight:700
  },
  locationDetailsLabel: {
    paddingRight:'300px',
    fontWeight:700,
    fontSize:'1.1rem',
    paddingBottom: theme.spacing.unit / 2
  },
  locationDetailheader:{
    display:'inherit'
  },
  locationHeader: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight:700,
  },
  locationPhone:{
    maxWidth: 'none'
  },
  locationName: {
    color: 'rgba(0, 0, 0, 0.87)',
    paddingBottom: theme.spacing.unit
  },
  locationInfo:{
    paddingLeft: theme.spacing.unit / 2,
    fontSize: '1rem',
    lineHeight: 1,
    letterSpacing: 0
  },
  formControlLabel: {
    width: '100%',
    marginLeft: '0px',
    paddingBottom: theme.spacing.unit
  },
  grid: {
    display: "inherit"
  },
  claimantGrid: {
   marginRight: theme.spacing.unit * 3
  },
  lineBreak: {
    borderBottom: '2px solid',
    marginTop: theme.spacing.unit * 0,
    paddingBottom: theme.spacing.unit
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSubmit: {
    marginTop: '20px'
  },
  buttonLocation:{
    textTransform: 'none',
    position: 'absolute',
  },
  addNewLocation: {
    width:'100%',
    height:'40px',
    paddingTop:'20px'
  },
  formWrapper: {
    ...theme.mixins.gutters(),
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: '191%',
    borderBottom: '2px solid',
    borderTop: '2px solid',
    borderLeft: '2px solid',
    borderRight: '2px solid'
  },
  uploadFileCard: {
    width: '100%',
    marginBottom: '10px',
    overflow: 'visible'
  },  
  banner: {
    marginTop: 10,
    paddingTop: theme.spacing.unit * 10
  },
  warningMessage: {
    width: '95%',
    marginBottom: '20px',
    padding: '10px',
    color: '#fff',
    background: red[500],
    borderRadius: 3
  }
});


const  NumberFormatCustom = props => {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      format="####"
      onValueChange={values => {
        onChange({
          target: {
            name,
            value: values.value
          },
        })
      }}
    />
  );
}

const OrderForm = (props) => {

    const classes = props.classes;

    const [isFetchUserComplete, setIsFetchUserComplete] = useState(false);
    const [user, setUser] = useState({});          
    useEffect(() => {
      const fetchUser = async () => {
          const userObj = await getUser();         
          if (userObj != null && userObj.access_token && !userObj.expired) {
            setUser(userObj);
          }
          setIsFetchUserComplete(true);
      }
      fetchUser();
    }, []);
   
    // Prefill the form from ClaimCenter.
    const [prefillData, setPrefillData] = useState( {serviceableType:'', claimantName:'', claimantDob:'', claimantSsn:'', claimNumber:'' } );
    const [serviceableItems, setServiceableItems] = useState( [] );
    const [isServiceableItemsLoading, setServiceableItemsLoading] = useState(false); 
    const [serviceableSelectedItem, setServiceableSelectedItem] = useState(null);
    //Serviceable Items
    useEffect(()=>{
      let defaultValue = null;
      setServiceableItemsLoading(true);
      GuidewireApiService.getServiceableCandidates().then((data)=>{ 
        if(data && data.length) {
          data.sort(function(a, b){
            if(a.displayableName < b.displayableName) { return -1; }
            if(a.displayableName > b.displayableName) { return 1; }
            return 0;
        })
          setServiceableItems(data.map(ListItem => ({
            value: ListItem.id,
            label: ListItem.displayableName,
          })));
          if(data.length === 1) {
            defaultValue = {
              value: data[0].id, 
              label: data[0].displayableName
            };
          }
        }
        setServiceableItemsLoading(false);
        if (defaultValue != null) {
          serviceableItemsChange(defaultValue);
        }
      })
    },[])

    const serviceableItemsChange = e => {
      setServiceableSelectedItem(e);
      if(e && e.value) {
        GuidewireApiService.getServiceableFormData(e.value).then((data)=>{
          setPrefillData({
            serviceableType: e.value,
            claimantName: data.name,
            claimantDob: data.dob ? new Date(data.dob) : data.dob,
            claimantSsn: data.ssn,
            claimNumber: data.claimNumber
          })
        })
      } else {
        setPrefillData({
          claimantName: "",
          claimantDob: "",
          claimantSsn: "",
          claimNumber: ""
        })
        
      }
    }

    // Fetch States function
    const [states, setStates] = useState( [] );
    useEffect(() => {
      const fetchStates = async () => {
        const result = await fetchMappedStates();
        setStates(result);
      }
      fetchStates();
    }, []);

    // Fetch RecordTypes
    const [recordTypes, setRecordTypes] = useState( [] );
    useEffect(() => {
      const fetchRecordTypes = async () => {
        const result = await fetchMappedRecordTypes();
        setRecordTypes(result);
      }
      fetchRecordTypes();
    }, []);

    // Fetch DocumentTypes
    const [documentTypes, setDocumentTypes] = useState( [] );
    useEffect(() => {
      const fetchDocumentTypes = async () => {
        const result = await fetchMappedDocumentTypes();
        setDocumentTypes(result);
      }
      fetchDocumentTypes();
    }, []);
    
    // Filepond related.
    const filepond = useRef(null);
    const [isFilepondReady, setIsFilepondReady] = useState(true);
    const [files, setFiles] = useState([]);

    const setFilesFromPond = () => {
      const filepondFiles = filepond.current.getFiles();      
      const updatedState = filepondFiles.map(fileItem => 
        ({ 
          fileName: fileItem.filename,
          tempFileName: fileItem.serverId,
          ready: fileItem.status === 5
        })
      );
      setFiles(updatedState);       
      // Check if filepond is in a ready state.
      // That means no errored or processing files.
      setIsFilepondReady(filepondFiles.every((file) => file.status === 5));
    }

    const isDuplicateFileName = (fileObj) => {
      // check if a file can be uploaded.      
      return files.find(f => f.fileName === fileObj.file.name) === undefined;      
    }

    const FileTypesList = (props) => {
      const { setFieldValue, handleChange, handleBlur, values } = props;

      files
        .filter(file => file.ready)
        .filter(file => values.uploadTypes.find(f => f.fileName === file.fileName) === undefined)
        .forEach((uploadedFile) => {        
          values.uploadTypes.push({
            fileName: uploadedFile.fileName,
            tempFileName: uploadedFile.tempFileName,
            docType: 0
          })
      });

      // update values.uploadTypes to remove deleted files.       
      values.uploadTypes = values.uploadTypes.filter(file => files.find(f => f.fileName === file.fileName))
      
      const handleDocTypeChange = (file, docType) => {
        const documentFile = values.uploadTypes.find(f => f.fileName === file.fileName);
        if(documentFile) {
          documentFile.docType = docType ? docType.value : 0;
          setFieldValue('uploadTypes', values.uploadTypes);
        }
      }


      return (               
        <FieldArray
            fullWidth
            name="uploadTypes"
            render={arrayHelpers => (
              values.uploadTypes.map((file, index) => (
                <Card key={index} className={classes.uploadFileCard}>
                  <CardContent>
                    <FormControl required className={classes.formControl} fullWidth margin="normal">
                        <TextField
                          name={`uploadTypes.${index}.fileName`}
                          label="File"
                          value={file.fileName}
                          className={classes.textField}
                          fullWidth
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                    </FormControl>
                    <FormControl required className={classes.formControl} fullWidth margin="normal">
                      <MySelect
                        name={`uploadTypes.${index}.docType`} 
                        handleChange={handleDocTypeChange.bind(this, file)}
                        handleBlur={handleBlur} 
                        options={documentTypes}      
                        value={documentTypes.find(t => t.value === file.docType)}
                        label="Document Type *"
                        placeholder=""
                        error={file.docType === 0}
                        helperText={file.docType === 0 && 'Required'}
                        isLoading={false} />                      
                    </FormControl>
                  </CardContent>
                </Card>                
              ))
          )}
        />
      );
    }

    /*** Locations search functions ***/
    const filterLocations = async searchTerm => {
      if (searchTerm.length >= 3) {
        let result = null;
        await axios.get(`${settings.MYO_API_BASE_URL}/locations/search`, {
          params: {
            SearchTerm: searchTerm
          }
        }).then(response => result = response);
        const facilities = result.data.map(location => ({
          value: location.locationId,
          label: getLocationLabel(location),
          selectedLabel: location.locationName
        }))
        facilities.unshift({
          label: <Button color="primary" className={classes.buttonLocation} title="If your location was not found, scroll down to click on Add New Location">If your location was not found, scroll down to click on "Add New Location" </Button>
        })
        facilities.push({
          label: <a href="#" className={classes.addNewLocation} onClick={() => setLocationModalOpen(true)} title="Add New Location">Add New Location </a>
        })
        return facilities
      }
      return [];
    }

    const getLocationLabel = loc => {
      let locData = [loc.typeName, loc.locationName, loc.departmentName, loc.address, loc.city, loc.stateName, loc.zipCode];
      return locData.filter(item => { return !! item }).join(' | ');
    } 

    const locationOptions = searchTerm =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(filterLocations(searchTerm));
        }, 1000);
      });
    /*** End locations search functions ***/

    /*** Get selected location functions ***/
    const fetchSelectedLocation = async (locationId) => {
      let location = null
      if(locationId > 0){
        await axios.get(`${settings.MYO_API_BASE_URL}/locations`, {
          params: {
            locationId: locationId
          }
        }).then(response => location = response.data);
      }
      return location;
    }

    const getSelectedLocation = locationId => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve(fetchSelectedLocation(locationId));
        }, 1000);
      });
    /*** End get selected location functions ***/

    // Open and close create location modal
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);

      //Isedit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // alert for clear location data
  const [showDialog, setShowDialog] = useState(false);

  const handleCloseDialog = () => {
    setShowDialog(false);
  }
  
    // clear location data.
  // Closes the remove dialog. 
  const handleClearData= () => {
    setLocationValues(defaultLocationValues);
    setShowDialog(false);
  }

  const handleEditMode = (value) => {
    setIsEditMode(true);
    setLocationModalOpen(true)
  }
  
    // Handle when cancel button is clicked in create location modal
    const handleCancelAddLocation = () => {
      setLocationModalOpen(false);
    }

    const defaultLocationValues = {
      locationName: '',
      locationDepartment: '',
      locationAddress: '',
      locationCity: '',
      locationState: null,
      locationZip: '',
      locationPhone: '',
      locationFax: ''
    }; 

    // sets the location values in the state
    const [locationValues, setLocationValues] = useState(defaultLocationValues);

    // Sets the location values to the data passed from the add location modal.
    // Closes the add location modal. 
    const handleAddLocation = (values) => {
      setLocationValues(values);
      setLocationModalOpen(false);
      setIsEditMode(false)
    }

    /* Banner messages */
    const [isBannerOpen, setBannerOpen] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("");

    // Scroll to the top if the banner is open.
    useEffect(() => {
      if (isBannerOpen)
        window.scrollTo(0,0);
    });
    
    return (
        <div className={classes.root}>
          {/* <AppBar position="static" color="default">
            <Toolbar> */}
              {/* <img src="Ontellus_logo_tagline_1_CMYK.png" width="200" height="80" /> */}
              {/* <Typography variant="h6" color="inherit">
              </Typography>
            </Toolbar>
          </AppBar> */}
          <AppBar position="static" className={classes.appBar} color="primary">
            <Toolbar>
              <Typography variant="h5" color="inherit">
                Ontellus Record Request
              </Typography>
            </Toolbar>
          </AppBar>
   
          { isBannerOpen && 
            <Banner message={bannerMessage}/>
          }

          <Grid container spacing={24}>
            <Grid item xs={6}>
                <div className={classes.formWrapper}>
                  <Formik
                    initialValues={{ 
                      serviceableType: prefillData.serviceableType,
                      claimantName: prefillData.claimantName, 
                      claimantDob: prefillData.claimantDob, 
                      claimantSsn: prefillData.claimantSsn, 
                      claimNumber: prefillData.claimNumber,
                      locationId: 0,
                      recordType: null,
                      scopeDetails: '',
                      allRecords: false,
                      fromDate: null,
                      toPresent: false,
                      toDate: null,
                      rush: false,
                      uploadTypes: [],
                      allowAddFacilityNamesToHipaaAuth: true
                    }}

                    enableReinitialize={true} 
                    
                    onSubmit={ async (values, { setSubmitting }) => {
                      const { 
                        claimNumber, rush, claimantName, claimantDob, 
                        claimantSsn, locationId, allRecords, toPresent, 
                        fromDate, toDate, recordType, scopeDetails, allowAddFacilityNamesToHipaaAuth, uploadTypes } = values;

                      let locId = locationId;

                      // If location ID equals 0 and the location name exists,
                      // then the user wants to create a new location.
                      if (locId === 0 && locationValues.locationName.length > 0) {
                        try {
                          const response = await createLocation({
                            locationName: locationValues.locationName,
                            streetAddress: locationValues.locationAddress,
                            city: locationValues.locationCity,
                            state: locationValues.locationState.value,
                            zip: locationValues.locationZip,
                            phone: locationValues.locationPhone,
                            fax: locationValues.locationFax
                          });
                          locId = response.data.locationId;
                        }
                        catch(error){
                          // Calls to MYO API failed. TODO: read problem details if they exist.
                          setBannerMessage("There was an unexpected error when creating the location.");
                          setBannerOpen(true);
                          setSubmitting(false);
                        }
                      }
                      
                      createAuth({
                        claimNumber,
                        rush,
                        claimant: {
                          name: claimantName,
                          dob: claimantDob,
                          ssn: claimantSsn,                         
                        },
                        recordLocation: {
                          locationId: locId,
                          allRecords,
                          toPresent,
                          fromDate,
                          toDate,
                          recordTypeId: recordType.value,
                          scope: scopeDetails
                        },
                        allowAddFacilityNamesToHipaaAuth,
                        uploadedFiles: uploadTypes
                      }).then(function(resp) {
                      // TODO: How to handle GW errors properly.
                      GuidewireApiService.createServiceRequest(resp.data.orderId, serviceableSelectedItem.value).then(function(values) {
                        values[0].navigate("servicerequest", values[1].referenceNumber);
                      });
                
                      setSubmitting(false);

                      }).catch(function(err) {
                        // Calls to MYO API failed. TODO: read problem details if they exist.
                        setBannerMessage("There was an unexpected error creating the order.");
                        setBannerOpen(true);
                        setSubmitting(false);
                      });
                  }}

                  validationSchema = {
                    Yup.object().shape({
                      serviceableType: Yup.string()
                      .strict(false)
                      .trim()
                      .required('Required'),
                      claimantName: Yup.string()
                        .strict(false)
                        .trim()
                        .min(1,"Please enter at least 1 character up to a maximum of 80")
                        .max(80,"Please enter at least 1 character up to a maximum of 80")
                        .required('Required'),
                      claimantDob: Yup
                        .date()
                        .typeError("Required")
                        .required('Required')
                        .max(new Date(), "Future dates are not allowed.")
                        .min(new Date('12/31/1899'), "Dates must be later than 12/31/1899"),
                      claimantSsn: Yup.string()
                        .strict(false)
                        .trim()
                        .min(4,"Invalid Data")
                        .max(4,"Invalid Data")
                        .required('Required'),
                      claimNumber: Yup.string()
                        .strict(false)
                        .trim()
                        .min(1,"Please enter at least 1 character up to a maximum of 40")
                        .max(40,"Please enter at least 1 character up to a maximum of 40")
                        .required("Required"),
                      fromDate: Yup
                        .mixed()  // We use mixed here instead of date so that 
                                  // we don't cause a yup typeError to invalidate 
                                  // the form and display an error when the value is null.
                        .test("fromDateRequiredWhenAllRecordsFalse", "Required", function (value) {
                            const { allRecords } = this.parent;
    
                            if (!allRecords && !value)
                               return false;
                            
                            return true;
                        }),
                      toPresent: Yup
                        .mixed(),
                      toDate: Yup
                        .mixed()
                        .test("toDateRequiredWhenAllRecordsOrToPresentNotSet", "Required", function(value) {
                          const { allRecords, toPresent } = this.parent;
                          
                          if (!allRecords && !toPresent && !value)
                            return false;
                          
                          return true;
                        })
                        .test("toDateMustBeGreaterThanFromDate", "To date must be later than the from date.", function(value) {
                          const { fromDate, toPresent, allRecords } = this.parent;

                          
                          if (!fromDate || toPresent || allRecords )
                            return true;

                          if (fromDate && value) {
                            const fromDateCopy = new Date(fromDate.valueOf());
                            const toDateCopy = new Date(value.valueOf());
  
                            fromDateCopy.setHours(0,0,0,0);
                            toDateCopy.setHours(0,0,0,0);
  
                            if (fromDateCopy > toDateCopy)
                              return false;
                          }

                          return true;
                        }),
                        recordType: Yup
                        .mixed()
                        .strict(false)
                        .required('Required'),
                        scopeDetails: Yup.string()
                        .strict(false)
                        .trim()
                        .min(1,"Please enter at least 1 character up to a maximum of 2048")
                        .max(2048,"Please enter at least 1 character up to a maximum of 2048")
                        .required('Required'),
                        uploadTypes: Yup
                          .array()
                          .of(
                             Yup.object().shape({
                               fileName: Yup.string().required(),
                               tempFileName: Yup.string().required(),
                               docType: Yup.number().moreThan(0),
                               })
                          )
                          .required('Please ensure that HIPAA authorization is uploaded')
                    })
                  }
                >
                  {(props) => {
                    const {
                      values,
                      touched,
                      errors,
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue
                    } = props;
                    return (
                      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
					  
                        <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <MySelect
                            error={errors.serviceableType && touched.serviceableType}
                            helperText={(errors.serviceableType && touched.serviceableType) && errors.serviceableType}
                            id="serviceableType"
                            name="serviceableType"
                            label="Related To *"
                            placeholder=""
                            required
                            options={serviceableItems}
                            value={serviceableSelectedItem}
                            isLoading={isServiceableItemsLoading}
                            disabled={isServiceableItemsLoading}
                            handleChange={(e)=> serviceableItemsChange(e)}
                            handleBlur={handleBlur}
                          />
                        </FormControl>
                        <Typography variant="subtitle1" className={classes.caseSectionLabel}>
                          CLAIMANT INFORMATION
                        </Typography>
                        <FormControl className={classes.lineBreak} fullWidth margin="normal">                        
                          <Grid item xs={12} className={classes.grid} >
                            <Grid item xs={6} className={classes.claimantGrid}>
                              <FormControl required className={classes.formControl} fullWidth margin="normal">
                                <TextField
                                  error={errors.claimantName && touched.claimantName}
                                  helperText={(errors.claimantName && touched.claimantName) && errors.claimantName}
                                  id="claimantName"
                                  name="claimantName"
                                  label="Name"
                                  className={classes.textField}
                                  required
                                  placeholder="First Middle Last Name"
                                  value={values.claimantName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  inputProps={{
                                    maxLength:80
                                  }}      
                                />
                              </FormControl> 
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl required className={classes.formControl} fullWidth margin="normal">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Field component={FormikDatePicker} name="claimantDob" label="Date of Birth *" className={classes.textField} maxDate={new Date()}/>
                                </MuiPickersUtilsProvider>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} className={classes.grid} >
                            <Grid item xs={6} className={classes.claimantGrid}>
                              <FormControl required className={classes.formControl} fullWidth margin="normal">
                                <TextField
                                  error={errors.claimantSsn && touched.claimantSsn}
                                  helperText={(errors.claimantSsn && touched.claimantSsn) && errors.claimantSsn}
                                  className={classes.textField}
                                  required
                                  label="SSN"
                                  placeholder="Last 4 digits of SSN"
                                  id="claimantSsn"
                                  name="claimantSsn"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={ values.claimantSsn}
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                    other: {
                                      onValueChange: val => setFieldValue('claimantSsn', val.floatValue),
                                        value: values.claimantSsn,
                                        name: 'claimantSsn'
                                      }
                                  }}
                                />
                              </FormControl>  
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl required className={classes.formControl} fullWidth margin="normal">
                                <TextField
                                  error={errors.claimNumber && touched.claimNumber}
                                  helperText={(errors.claimNumber && touched.claimNumber) && errors.claimNumber}
                                  id="claimNumber"
                                  name="claimNumber"
                                  label="Claim Number"
                                  placeholder ="Enter Claim Number"
                                  className={classes.textField}
                                  required
                                  value={values.claimNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  inputProps={{
                                    maxLength:40
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </FormControl>
                        {/* <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <TextField
                            id="claimantAddress"
                            name="claimantAddress"
                            label="Address"
                            className={classes.textField}
                            fullWidth
                            value={form.claimantAddress}
                            onChange={updateFormField}
                          />
                        </FormControl> */}
                        {/* <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <TextField
                            id="claimantCity"
                            name="claimantCity"
                            label="City"
                            className={classes.textField}
                            fullWidth
                            value={form.claimantCity}
                            onChange={updateFormField}
                          />
                        </FormControl> */}
                        {/* <FormControl required className={classes.formControlMySelect} fullWidth margin="normal"> */}
                          {/* <Query
                            query={
                              gql`
                                {
                                    caseTypes {
                                        value: id,
                                        label: name
                                    }
                                }
                              `
                            }>
                            {({ loading, error, data }) => {
                              var options = loading || error ? [] : data.caseTypes; 

                              // if (error) return (
                              //   <Redirect push to="/error" />
                              // )

                              return (
                                <MySelect
                                  id="claimantState"
                                  name="claimantState"
                                  value={form.claimantState} 
                                  handleChange={updateClaimantState} 
                                  options={options}
                                  isLoading={loading}
                                  placeholder="State" />
                              );
                            }}


                          </Query> */}
                        {/* <MySelect
                                  id="claimantState"
                                  name="claimantState"
                                  value={form.claimantState} 
                                  handleChange={updateClaimantState} 
                                  options={[]}
                                  isLoading={false}
                                  placeholder="State" />  
                        </FormControl>*/}
                        {/* <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <TextField
                            id="claimantZip"
                            name="claimantZip"
                            value={form.claimantZip}
                            label="Zip"
                            className={classes.textField}
                            onChange={updateFormField}
                            fullWidth
                            InputProps={{
                              inputComponent: ZipFormatCustom,
                            }}
                          />
                        </FormControl> */}
                        {/* <Typography variant="subtitle1" className={classes.caseSectionLabel}>
                          Case
                        </Typography>
                        <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <TextField
                            id="plaintiff"
                            name="plaintiff"
                            label="Plaintiff"
                            className={classes.textField}
                            fullWidth
                            value={form.plaintiff}
                            onChange={updateFormField}
                          />
                        </FormControl> */}
                        {/* <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <TextField
                            id="defendant"
                            name="defendant"
                            label="Defendant"
                            className={classes.textField}
                            fullWidth
                            value={form.defendant}
                            onChange={updateFormField}
                          />
                        </FormControl>
                        <FormControl required className={classes.formControl} fullWidth margin="normal" >
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                              keyboard
                              label="Trial Date"
                              format="MM/dd/yyyy" // DateFNs format.
                              placeholder="mm/dd/yyyy"
                              // handle clearing outside => pass plain array if you are not controlling value outside
                              mask={value =>
                                value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : []
                              }
                              disableOpenOnEnter
                              value={form.trialDate}
                              onChange={updateTrialDate}
                            />
                          </MuiPickersUtilsProvider>
                        </FormControl>
                        <FormControl required className={classes.formControl} fullWidth margin="normal">
                          <TextField
                            id="adjusterName"
                            name="adjusterName"
                            label="Adjuster Name"
                            className={classes.textField}
                            fullWidth
                            placeholder="First Last Name"
                            value={form.adjusterName}
                            onChange={updateFormField}
                          /> 
                        </FormControl> */}
                        <Typography variant="subtitle1" className={classes.caseSectionLabel}>
                            LOCATION INFORMATION
                        </Typography>
                        <FormControl className={classes.lineBreak} fullWidth margin="normal">   
                          <FormControl required className={classes.formControl} fullWidth margin="normal">
                            <MySelect
                              name="facility"
                              id="facility"
                              placeholder=""
                              label="Facility Search"
                              async="true"
                              isLoading={false}
                              enableTooltip = {true}
                              customValue={locationValues.locationName}
                              isCacheable={false}
                              disabled={locationValues.locationName.length > 0 && values.locationId === 0}
                              options={searchTerm => searchTerm.length >= 3 ? locationOptions(searchTerm) : {}}
                              handleChange={loc => {
                                if (loc != null) { loc.label = loc.selectedLabel } 
                                const selectedLocation = getSelectedLocation(loc != null ? loc.value : 0);
                                selectedLocation.then(response => {
                                  setFieldValue('locationId', response != null ? response.id : 0);
                                  setLocationValues({
                                    locationName: response != null ? response.name : '',
                                    locationDepartment: response != null ? response.departmentName : '',
                                    locationAddress: response != null ? response.address : '',
                                    locationCity: response != null ? response.city : '',
                                    locationState: response != null ? states.find(s => {return s.value === response.stateId}) : null,
                                    locationZip: response != null ? response.zipCode : '',
                                    locationPhone: response != null ? response.phone : '',
                                    locationFax: response != null ? response.fax : ''
                                  });                          
                                });
                              }}
                            />
                          </FormControl>
                          {locationValues.locationName.length > 0 &&
                          <FormControl className={classes.formControl} fullWidth margin="normal">
                              <div className={classes.locationDetailheader}>
                              <Typography variant="subtitle1" className={classes.locationDetailsLabel}>
                                Location Details:
                              </Typography>
                            {(locationValues.locationName.length > 0 && values.locationId === 0) ?
                            <div>
                              <Button
                                  color="primary"
                                  onClick={() => handleEditMode(true)}>
                                  Edit
                              </Button>
                              <Button
                                color="primary"
                                onClick={() => setShowDialog(true)}>
                                Remove
                              </Button>
                            </div>
                                :
                                null
                              }
                            </div>
                              
                              <FormLabel className={classes.locationName}>{locationValues.locationName}</FormLabel>
                              {locationValues.locationDepartment && locationValues.locationDepartment.length > 0 &&
                              <FormControlLabel
                                classes={{ label: classes.locationInfo }}
                                className={classes.formControlLabel}
                                control={<FormLabel className={classes.locationHeader}>Department:</FormLabel>}
                                label={locationValues.locationDepartment}
                              />}
                              <FormControlLabel
                                classes={{ label: classes.locationInfo }}
                                className={classes.formControlLabel}
                                control={<FormLabel className={classes.locationHeader}>Address:</FormLabel>}
                                label={locationValues.locationAddress + ' ' + locationValues.locationCity + ' ' + locationValues.locationState.label + ' ' + locationValues.locationZip}
                              />
                              <Grid item xs={12} className={classes.grid} >
                                  <Grid item xs={4} className={classes.locationPhone}>
                                    <FormControlLabel
                                      classes={{ label: classes.locationInfo }}
                                      className={classes.formControlLabel}
                                      control={<FormLabel className={classes.locationHeader}>Ph:</FormLabel>}
                                      label={locationValues.locationPhone}
                                    />
                                  </Grid>
                                  <Grid item xs={8}>
                                    {locationValues.locationFax.length > 0 &&
                                    <FormControlLabel
                                      classes={{ label: classes.locationInfo }}
                                      className={classes.formControlLabel}
                                      control={<FormLabel className={classes.locationHeader}>Fax:</FormLabel>}
                                      label={locationValues.locationFax}
                                    />}
                                  </Grid>
                              </Grid>
                          </FormControl>}
                          <FormControlLabel
                            margin="normal"
                            control={
                              <Checkbox
                                id="allRecords"
                                name="allRecords"
                                color="primary"
                                value={values.allRecords.toString()}
                                onChange={handleChange}
                              /> 
                            }
                            label="Any and All Records"
                          />
                          <FormControl className={classes.formControl} fullWidth margin="normal">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Field component={FormikDatePicker} name="fromDate" label={values.allRecords ? "From" : "From *"} maxDate={new Date()} disabled={values.allRecords}/>
                            </MuiPickersUtilsProvider>
                          </FormControl>
                          <FormControlLabel
                            margin="normal"
                            control={
                              <Checkbox
                                id="toPresent"
                                name="toPresent"
                                color="primary"
                                value={values.toPresent.toString()}
                                onChange={handleChange}
                                disabled={values.allRecords}
                              /> 
                            }
                            label="To Present"
                          />
                          <FormControl className={classes.formControl} fullWidth margin="normal">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Field component={FormikDatePicker} name="toDate" label={values.allRecords || values.toPresent ? "To" : "To *"} maxDate={new Date()} disabled={values.allRecords || values.toPresent}/>
                            </MuiPickersUtilsProvider>
                          </FormControl>
                          <FormControl required className={classes.formControl} fullWidth margin="normal">
                            <MySelect
                              error={errors.recordType && touched.recordType}
                              helperText={(errors.recordType && touched.recordType) && errors.recordType}
                              id="recordType"
                              name="recordType"
                              placeholder=""
                              label="Record Type *"
                              options={recordTypes}
                              value={values.recordType}
                              isLoading={false}
                              handleChange={
                                recordType => {
                                  setFieldValue('recordType', recordType);
                                  setFieldValue('scopeDetails', recordType ? recordType.scopeDetails : '');
                                }
                              }
                            />
                          </FormControl>
                          <FormControl required className={classes.formControl} fullWidth margin="normal">                        
                            <TextField
                              error={errors.scopeDetails && touched.scopeDetails}
                              helperText={(errors.scopeDetails && touched.scopeDetails) && errors.scopeDetails}
                              id="scopeDetails"
                              name="scopeDetails"
                              label="Scope Details"
                              required
                              className={classes.textField}
                              multiline
                              rows="5"
                              inputProps={{ maxLength: 2048 }}
                              value={values.scopeDetails}
                              onChange={handleChange}
                            />
                          </FormControl>
                          <FormControlLabel
                            margin="normal"
                            control={
                              <Checkbox
                                id="rush"
                                name="rush"
                                color="primary"
                                value={values.rush.toString()}
                                onChange={handleChange}
                              /> 
                            }
                            label="Rush"
                          />
                        </FormControl>  
                        <Typography variant="subtitle1" className={classes.caseSectionLabel}>
                          DOCUMENT UPLOAD
                        </Typography>
                        
                        <FormControl required className={classes.formControl} fullWidth margin="normal" disabled={isFetchUserComplete}>
                          <FilePond 
                            server={{
                              process: (fieldName, file, metadata, load, error, progress, abort) => {
                                const fileInfo = { 'filename': file.name, 'totalFileSize': file.size };

                                const formData = new FormData();
                                formData.append('fileInfo', JSON.stringify(fileInfo));
                                formData.append('file', file);
                                
                                // aborting the request
                                const CancelToken = axios.CancelToken;
                                const source = CancelToken.source();
                                
                                axios({
                                  method: 'POST',
                                  url: `${settings.MYO_API_BASE_URL}/files`,
                                  data: formData,
                                  cancelToken: source.token,
                                  onUploadProgress: (e) => {
                                    // updating progress indicator
                                    progress(e.lengthComputable, e.loaded, e.total);
                                  }
                                }).then(response => {
                                  // passing the file id to FilePond
                                  load(response.data);
                                }).catch((thrown) => {
                                  if (axios.isCancel(thrown)) {
                                    console.log('Request canceled', thrown.message);
                                  } else {
                                      // handle error
                                  }
                                })

                                // Setup abort interface
                                return {
                                  abort: () => {
                                    source.cancel('Operation canceled by the user.');
                                    abort();
                                  }
                                }
                              }
                            }}
                            ref={filepond} 
                            allowMultiple={true}
                            allowReplace={false}                            
                            required={true}
                            checkValidity={true}
                            beforeAddFile={isDuplicateFileName}
                            onaddfile={ (error, fileObj) => {
                              if (!error) {
                                fileObj.setMetadata('filename', fileObj.file.name);
                                fileObj.setMetadata('totalFileSize', fileObj.file.size);
                              }
                            }}
                            onupdatefiles={ fileItems => {                              
                              setFilesFromPond();
                            }}
                            onprocessfiles={ () => {
                              setFilesFromPond();
                            }}
                            onerror={(error) => {
                              setFilesFromPond();
                            }}
                            onprocessfilerevert={ () => {
                              setFilesFromPond();
                            }}
                            onprocessfile={(error, file) => {
                              setFilesFromPond();
                            }}

                            />
                        </FormControl>                                                
                        
                        {
                          values.uploadTypes.length === 0 && errors.uploadTypes && touched.uploadTypes && <div className={classes.warningMessage}>{errors.uploadTypes}</div>
                        }

                        {FileTypesList({setFieldValue, handleChange, handleBlur, values})}

                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormLabel component="legend" focused={false}>I authorize Ontellus to insert the facility name(s) submitted with my order on the executed patient HIPAA authorization provided.</FormLabel>
                          <RadioGroup
                            row                            
                            aria-label="allowAddFacilityNamesToHipaaAuth"
                            name="allowAddFacilityNamesToHipaaAuth"
                            className={classes.group}
                            value={values.allowAddFacilityNamesToHipaaAuth.toString()} 
                            onChange={(e) => { setFieldValue('allowAddFacilityNamesToHipaaAuth', e.target.value) }}
                          >
                            <FormControlLabel value="true" control={<Radio  color="primary" />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio color="primary" />} label="No" />
                          </RadioGroup>
                        </FormControl>

                        <Button type="submit" className={classes.buttonSubmit}
                         color="primary" 
                         variant="contained" 
                         disabled={isSubmitting || !isFilepondReady}
                        >
                          Submit
                          {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </Button>
                        
                        {/* <DisplayFormikState {...props} /> */}
                      </form>
                    );
                    }}
                  </Formik>
                  <Dialog
                    open={isLocationModalOpen}
                    onClose={() => setLocationModalOpen(false)}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      {isEditMode ? "Edit New Location" : "Create New Location"}
                    </DialogTitle>
                    <DialogContent>
                      <CreateLocationModal
                        initialData={locationValues}
                        onCancel={handleCancelAddLocation}
                        onAddLocation={handleAddLocation}
                        isEditMode = {isEditMode}
                       />
                    </DialogContent>
                  </Dialog>
                  <div>
            <Dialog
              open={showDialog}
              onClose={() => setShowDialog(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                CLEAR LOCATION
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Are you sure, you want this location details to be cleared?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClearData} color="primary">
                  Yes
                </Button>
                <Button onClick={handleCloseDialog} color="primary" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
            </div>
                </div>
            </Grid>
          </Grid>
        </div>
    );
}

export const DisplayFormikState = props =>
  <div style={{ margin: '1rem 0' }}>
    {/*<h3 style={{ fontFamily: 'monospace' }} />*/}
    <pre
      style={{
        background: '#f6f8fa',
        fontSize: '.65rem',
        padding: '.5rem',
      }}
    >
      <strong>props</strong> ={' '}
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>;

export default withStyles(styles)(OrderForm);
import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { Formik } from 'formik';
import { fetchMappedCase, getDonwloadLink } from '../Services/MyoApiService';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableBody';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        display: "flex",
        font: 'normal 13px/16px "Open Sans",helvetica,sans-serif',
        flexGrow: 1
    },
    formControl: {
        margin: theme.spacing.unit * 3,
        width: "100%"
    },
    formGroup: {
        flexDirection: "row"
    },
    formLabel: {
        width: "100%"
    },
    label: {
        width: "100%",
        paddingLeft: '15px'
    },
    customlabel:{
        width: "100%",
        paddingLeft: '15px',
        fontWeight: 'bold',
    },
    grid: {
        borderBottom:' 1px solid rgb(209, 196, 196)',
        display: "inherit"
    },
    innergrid: {
        display: "inherit"
    },
    formControlLabel: {
        width: '100%',
        marginLeft: '0px',
    },
    legend: {
        fontWeight: 'bold',
        width: '275px',
        textAlign: 'right',
        color: '#232323',
        fontSize:'15px'
    },
    divHeaders: {
        fontWeight: 'bold',
        color: '#232323',
        lineHeight:'30px'
    },
    headersalign:{
        width:'200px',
        textAlign:'right'
    },
    tableHeaders: {
        fontWeight: 'bold',
        color: '#232323'
    }
});

// Donwload file
const onDownloadClick = (fileId) => {
    getDonwloadLink(fileId).then( (res) => {
        window.location = res.url;
    });
}

const GuidewireWorkStatus = (props) => {
    const { classes } = props;

    const queryStr = props.history.location.pathname;
    const str = queryStr.split("/");
    const caseId = parseInt(str[3]);

    const [form, setFormValues] = useState({});
    const [isOntellusTabLoading, setOntellusTabLoading] = useState(true);
    const [isFetchingCaseFailed, setFetchingCaseFailed] = useState(false);
    const [isFetchingCaseForbidden,setFetchingCaseForbidden] = useState(false);

    useEffect(() => {
        const fetchCase = async () => {
            const caseObj = await fetchMappedCase(caseId);
            setFormValues(caseObj);
            setOntellusTabLoading(false);
            setFetchingCaseFailed(false);
            setFetchingCaseForbidden(false);
        }
        fetchCase()
            .catch(function(error) {
            setOntellusTabLoading(false);
            setFetchingCaseFailed(false);
            setFetchingCaseForbidden(false);
            if(error.response.status === 403){
                setFetchingCaseForbidden(true); 
            }else{
                setFetchingCaseFailed(true);
            }
              
        })
      
    }, [caseId]);

    return (
        <div className={classes.root}>
            {isOntellusTabLoading ?
                <LinearProgress 
                style={{width:'100%'}}
                />
                :
        <div className="">
            {(isFetchingCaseFailed || isFetchingCaseForbidden) ?
                <div className=""  style={{'fontWeight':'bold', 'fontSize':'14px', paddingTop:'15px', paddingLeft:'50px' }}>
            {isFetchingCaseFailed && 
                <p>An error has occurred while fetching data on the selected Service Request.  Please try again.</p>
                } 
            {isFetchingCaseForbidden &&
                <p> In order to view details on the Service Request, you need to be a Scheduling Party on the case.</p>
                } 
        </div>
            :
                
            <Formik
                initialValues={{
                    orderNumber: form.orderNumber,
                    orderDate: form.orderDate,
                    orderStatus: form.orderStatus,
                    patientName: form.patientName,
                    patientDob: form.patientDob,
                    patientSSN: form.patientSSN,
                    patientClaimNumber: form.patientClaimNumber,
                    providerName: form.providerName,
                    providerRush: form.providerRush,
                    providerRecordType: form.providerRecordType,
                    providerDateRange: form.providerDateRange,
                    providerScope: form.providerScope,
                    providerAddress: form.providerAddress,
                    providerCity: form.providerCity,
                    providerState: form.providerState,
                    providerPostalCode: form.providerPostalCode,
                    providerPhone: form.providerPhone,
                    providerFax: form.providerFax,
                    documents: form.documents,
                    remarks: form.remarks
                }}
                enableReinitialize={true}
            >
                {(props) => {
                    const {
                        values,
                    } = props;
                    return (
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="div" className={classes.divHeaders}>
                                <div  className={classes.headersalign}>ORDER INFORMATION</div>
                            </FormLabel>
                            <Grid item xs={12} className={classes.grid} >
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.customlabel }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Order#:</FormLabel>}
                                        label={values.orderNumber}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Order Date:</FormLabel>}
                                        label={values.orderDate}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.customlabel }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Status/type:</FormLabel>}
                                        label={values.orderStatus}
                                    />
                                </Grid>
                            </Grid>
                            <FormLabel component="div" className={classes.divHeaders}>
                                <div  className={classes.headersalign}>CLAIMANT INFORMATION</div>
                        </FormLabel>
                            <Grid item xs={12} className={classes.grid} >
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Name:</FormLabel>}
                                        label={values.patientName}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>DOB:</FormLabel>}
                                        label={values.patientDob}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>SSN:</FormLabel>}
                                        label={values.patientSSN}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Claim Number:</FormLabel>}
                                        label={values.patientClaimNumber}
                                    />
                                </Grid>
                            </Grid>
                            <FormLabel component="div" className={classes.divHeaders}>
                               <div className={classes.headersalign}>LOCATION INFORMATION</div> 
                            </FormLabel>
                            <Grid item xs={12} className={classes.innergrid} >
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Name:</FormLabel>}
                                        label={values.providerName}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Record Type:</FormLabel>}
                                        label={values.providerRecordType}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Rush:</FormLabel>}
                                        label={values.providerRush}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Date Range:</FormLabel>}
                                        label={values.providerDateRange}
                                    />
                                </Grid>

                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    classes={{ label: classes.label }}
                                    className={classes.formControlLabel}
                                    style={{ paddingBottom: '13px', paddingTop: '13px' }}
                                    control={<FormLabel component="legend" style={{ 'width': '236px' }} className={classes.legend}>Scope:</FormLabel>}
                                    label={values.providerScope}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.grid} >
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Address:</FormLabel>}
                                        label={values.providerAddress}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>State:</FormLabel>}
                                        label={values.providerState}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Phone:</FormLabel>}
                                        label={values.providerPhone}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>City:</FormLabel>}
                                        label={values.providerCity}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Postal Code:</FormLabel>}
                                        label={values.providerPostalCode}
                                    />
                                    <FormControlLabel
                                        classes={{ label: classes.label }}
                                        className={classes.formControlLabel}
                                        control={<FormLabel component="legend" className={classes.legend}>Fax:</FormLabel>}
                                        label={values.providerFax}
                                    />
                                </Grid>

                            </Grid>
                            
                            <FormLabel component="div" className={classes.divHeaders}>
                               <div className={classes.headersalign}>ONTELLUS REMARKS</div> 
                            </FormLabel>
                            <Grid item xs={12} className={classes.grid}>
                                <Table>
                                    <TableBody>
                                        {values.remarks && values.remarks.length > 0 ? (
                                                values.remarks.map(r => (
                                                <TableRow key={r.recordLocationLogId}>                                                    
                                                    <TableCell>
                                                        [{new Date(r.dateEntered).toLocaleDateString()}] {r.remarks}
                                                    </TableCell>                                                    
                                                </TableRow>
                                        ))) : null}
                                    </TableBody>
                                </Table>
                            </Grid>

                            <FormLabel component="div" className={classes.divHeaders}>
                               <div className={classes.headersalign}>RECORDS OBTAINED</div> 
                            </FormLabel>
                            {values.documents && values.documents.length > 0 ? (
                                <Grid item xs={12} className={classes.grid} >
                                    <Grid item xs={6}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableHeaders}>Document&nbsp;Name</TableCell>
                                                    <TableCell className={classes.tableHeaders}>Doc&nbsp;Type</TableCell>
                                                    <TableCell className={classes.tableHeaders}>Upload&nbsp;Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>                                            
                                                {values.documents.map(document => (
                                                    <TableRow key={document.fileId}>
                                                        <TableCell>
                                                            <Button color="primary" onClick={() => onDownloadClick(document.fileId)}>{document.name}</Button>
                                                        </TableCell>
                                                        <TableCell>{document.type}</TableCell>
                                                        <TableCell>{new Date(document.dateEntered).toLocaleDateString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                                 ) : (
                                    <Grid item xs={12} className={classes.grid} >
                                        <Grid item xs={6}>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>  
                                                        <TableCell>
                                                            No records to show
                                                        </TableCell>
                                                    </TableRow>  
                                                </TableBody>
                                            </Table>
                                        </Grid>
                                    </Grid>
                                 ) }
                        </FormControl>

                    );
                }}
            </Formik>
            }
        </div>
        }
        </div>
    );
}

export default withStyles(styles)(GuidewireWorkStatus);
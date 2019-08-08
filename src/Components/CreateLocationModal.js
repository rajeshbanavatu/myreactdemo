import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MySelect from './MySelect';
import NumberFormat from 'react-number-format';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import { fetchMappedStates } from '../Services/MyoApiService';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formWrapper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit
  },
  alignRight: {
    float: "right"
  }
});

const  ZipFormatCustom = props => {
  const { inputRef, onChange, name, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      format="#####"
      onValueChange={values => {
        onChange({
          target: {
            name,
            value: values.value
          }
        })
      }}
    />
  );
}

const  PhoneFaxFormatCustom = props => {
  const { inputRef, onChange, name, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      format="###-###-####"
      onValueChange={values => {
        onChange({
          target: {
            name,
            value: values.formattedValue
          }
        })
      }}
    />
  );
}

const CreateLocationModal = (props) => {
  const { initialData, onCancel, onAddLocation, isEditMode } = props;
  const classes = props.classes;

  // Fetch States function
  const [states, setStates] = useState( [] );
  useEffect(() => {
    const fetchStates = async () => {
      const result = await fetchMappedStates();
      setStates(result);
    }
    fetchStates();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.formWrapper}>
        <Formik
          initialValues={{
            locationName: initialData.locationName,
            locationAddress: initialData.locationAddress,
            locationCity: initialData.locationCity,
            locationState: initialData.locationState,
            locationZip: initialData.locationZip,
            locationPhone: initialData.locationPhone,
            locationFax: initialData.locationFax
          }}
          enableReinitialize={true}

          onSubmit={(values, { setSubmitting }) => {
            onAddLocation(values);
            setSubmitting(false);
          }}

          validationSchema = {
            Yup.object().shape({
              locationName: Yup
                .string()
                .strict(false)
                .trim()
                .min(1,"Please enter at least 1 character up to a maximum of 160")
                .max(160,"Please enter at least 1 character up to a maximum of 160")
                .required('Required'),
              locationAddress: Yup
                .string()
                .strict(false)
                .trim()
                .min(1,"Please enter at least 1 character up to a maximum of 120")
                .max(120,"Please enter at least 1 character up to a maximum of 120")
                .required('Required'),
              locationCity: Yup
                .string()
                .strict(false)
                .trim()
                .min(1,"Please enter at least 1 character up to a maximum of 40")
                .max(40,"Please enter at least 1 character up to a maximum of 40")
                .required('Required'),
              locationState: Yup
                .mixed()
                .required('Required'),
              locationZip: Yup
                .string()
                .strict(false)
                .trim()
                .min(5,"Please enter 5 digits")
                .max(5,"Please enter 5 digits")
                .required('Required'),
              locationPhone: Yup
                .string()
                .strict(false)
                .trim()
                .min(12,"Please enter 10 digits") // We must require 12 characters, but tell the user 10 digits because the dashes are included
                .max(12,"Please enter 10 digits") // ex: 123-456-7890 has 12 characters, but the user only enters the 10 digits
                .required('Required'),
              locationFax: Yup
                .string()
                .strict(false)
                .trim()
                .min(12,"Please enter 10 digits") // Same for fax.
                .max(12,"Please enter 10 digits")
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
            setFieldValue,
          } = props;
          return (
            <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
              <FormControl required className={classes.formControl} fullWidth margin="normal">
                <TextField
                  error={errors.locationName && touched.locationName}
                  helperText={(errors.locationName && touched.locationName) && errors.locationName}
                  id="locationName"
                  name="locationName"
                  label="Facility"
                  className={classes.textField}
                  fullWidth
                  multiline
                  required
                  placeholder="Enter Facility Name"
                  value={values.locationName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{
                    maxLength: 160
                  }}
                />
              </FormControl>
              <FormControl required className={classes.formControl} fullWidth margin="normal">
                <TextField
                  error={errors.locationAddress && touched.locationAddress}
                  helperText={(errors.locationAddress && touched.locationAddress) && errors.locationAddress}
                  id="locationAddress"
                  name="locationAddress"
                  label="Street Address"
                  placeholder="Enter Street Address"
                  className={classes.textField}
                  multiline
                  required
                  value={values.locationAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{
                    maxLength: 120
                  }}
                />
              </FormControl>
              <FormControl required className={classes.formControl} fullWidth margin="normal">
                <TextField
                  error={errors.locationCity && touched.locationCity}
                  helperText={(errors.locationCity && touched.locationCity) && errors.locationCity}
                  id="locationCity"
                  name="locationCity"
                  label="City"
                  placeholder="Enter City"
                  className={classes.textField}
                  required
                  value={values.locationCity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{
                    maxLength: 40
                  }}
                />
              </FormControl>
              <FormControl required className={classes.formControl} fullWidth margin="normal">
                <MySelect
                  error={errors.locationState && touched.locationState}
                  helperText={(errors.locationState && touched.locationState) && errors.locationState}
                  id="locationState"
                  name="locationState"
                  label="State *"
                  placeholder=""
                  required
                  value={values.locationState}
                  options={states}
                  handleChange={state => setFieldValue('locationState', state)}
                  isLoading={false}
                />
              </FormControl>
              <FormControl required className={classes.formControl} fullWidth margin="normal">
                <TextField
                  error={errors.locationZip && touched.locationZip}
                  helperText={(errors.locationZip && touched.locationZip) && errors.locationZip}
                  id="locationZip"
                  name="locationZip"
                  label="Zip Code"
                  placeholder="Enter Zip Code"
                  className={classes.textField}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.locationZip}
                  InputProps={{
                    inputComponent: ZipFormatCustom,
                    other: {
                      onValueChange: zipCode => setFieldValue('locationZip', zipCode),
                      value: values.locationZip,
                      name: 'locationZip'
                    }
                  }}
                />
              </FormControl>
              <FormControl required className={classes.formControl} fullWidth margin="normal">
                <TextField
                  error={errors.locationPhone && touched.locationPhone}
                  helperText={(errors.locationPhone && touched.locationPhone) && errors.locationPhone}
                  id="locationPhone"
                  name="locationPhone"
                  label="Phone Number"
                  placeholder="xxx-xxx-xxxx"
                  className={classes.textField}
                  required
                  onChange={handleChange}
                  value={values.locationPhone}
                  onBlur={handleBlur}
                  InputProps={{
                    inputComponent: PhoneFaxFormatCustom,
                    other: {
                      onValueChange: phone => setFieldValue('locationPhone', phone),
                      value: values.locationPhone,
                      name: 'locationPhone'
                    }
                  }}
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth margin="normal">
                <TextField
                  error={errors.locationFax && touched.locationFax}
                  helperText={(errors.locationFax && touched.locationFax) && errors.locationFax}
                  id="locationFax"
                  name="locationFax"
                  label="Fax Number"
                  placeholder="xxx-xxx-xxxx"
                  className={classes.textField}
                  onChange={handleChange}
                  value={values.locationFax}
                  onBlur={handleBlur}
                  InputProps={{
                    inputComponent: PhoneFaxFormatCustom,
                    other: {
                      onValueChange: fax => setFieldValue('locationFax', fax),
                      value: values.locationFax,
                      name: 'locationFax'
                    }
                  }}
                />
              </FormControl>
              <div className={classes.alignRight}>
                <Button 
                  variant="contained" 
                  className={classes.button} 
                  disabled={isSubmitting}
                  onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" className={classes.button} variant="contained" disabled={isSubmitting}>
                  {isEditMode ? 'Save' : "Add"}
                </Button>
                {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
export default withStyles(styles)(CreateLocationModal);
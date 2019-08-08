import React from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import Select from 'react-select';
import PropTypes from "prop-types"
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import AsyncSelect from 'react-select/lib/Async';

const styles = theme => ({
    root: {
      flexGrow: 1,
      height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      top: 0,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
});

const NoOptionsMessage = (props) => {
    return (
        <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
        >
        {props.children}
        </Typography>
    );
}

const inputComponent = ({ inputRef, ...props}) => {
    return <div ref={inputRef} {...props} />;
};

const Control = (props) => {
    return (
      <TextField
        fullWidth
        error={props.error}
        helperText={props.helperText}
        InputProps={{
          inputComponent,
          inputProps: {
            className: props.selectProps.classes.input,
            inputRef: props.innerRef,
            children: props.children,
            ...props.innerProps,
          },
        }}
        {...props.selectProps.textFieldProps}
      />
    );
};

const Option = (props) => {
    return (
      <MenuItem
        buttonRef={props.innerRef}
        selected={props.isFocused}
        component="div"
        title={props.selectProps.enableTooltip ? props.data.label : null}
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
}

const Placeholder = (props) => {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
}

const SingleValue = (props) => {
    return (
      <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
      </Typography>
    );
}

const ValueContainer = (props) => {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

const Menu = (props) => {
    return (
      <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
        {props.children}
      </Paper>
    );
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
 };

const MySelect = (props) => {
  const { classes, error, helperText, theme,enableTooltip, customValue, value, handleChange, options, isLoading, label, placeholder, disabled, async, isCacheable } = props;
    const selectStyles = {
        input: base => ({
          ...base,
          color: theme.palette.text.primary,
          '& input': {
            font: 'inherit',
          },
        }),
     };
     return async ? (
      <NoSsr>
        <AsyncSelect
          placeholder={placeholder}
          classes={classes}
          styles={selectStyles}
          onChange={handleChange}
          loadOptions={options}
          components={components}
          cacheOptions={typeof isCacheable !== 'undefined' ? isCacheable : true}
          isLoading={isLoading}
          isDisabled={disabled}
          isClearable 
          enableTooltip = {enableTooltip}
          textFieldProps={{
            label:label,
            InputLabelProps: (customValue || value) ? {
              shrink: true,
            }:"",
            error:error,
            helperText:helperText
          }} 
        />
      </NoSsr>
    ) : 
    (
      <NoSsr>
        <Select
          placeholder={placeholder}
          classes={classes}
          styles={selectStyles}
          options={options}
          components={components}
          value={value}
          onChange={handleChange}
          isClearable
          isLoading={isLoading}
          isDisabled={disabled}
          filterOption={(o, r) => { return o.label.toLowerCase().indexOf(r.toLowerCase()) === 0; }}
          textFieldProps={{
            // margin: "normal",
            label:label,
            InputLabelProps: value ? {
              shrink: true,
            }: "",
            error:error,
            helperText:helperText
          }}   
        />
      </NoSsr>
    );
};
MySelect.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    value: PropTypes.object,
    options: PropTypes.any.isRequired,
    isLoading: PropTypes.bool.isRequired,
    placeholder: PropTypes.string,
    isCacheable: PropTypes.bool
};

export default withStyles(styles, { withTheme: true })(MySelect);
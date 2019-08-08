import React from "react";
import { InlineDatePicker } from "material-ui-pickers";

export const FormikDatePicker = ({
    form: { setFieldValue, handleBlur, errors, touched },
    field: { name, value },
    label,
    maxDate,
    ...rest
}) => {
    const getDateWithAddLocalOffset = (date) => {
        //value is  undefined or null or empty
        if (date == "" || date == null) return null;
        //adding offset value
        let timestamp = date.getTime();
        return timestamp + new Date(date).getTimezoneOffset() * 60000;
    }

    return (
        <InlineDatePicker
            name={name}
            label={label}
            error={errors[name] && touched[name]}
            helperText={(errors[name] && touched[name]) && errors[name]}
            maxDate={maxDate ? maxDate : undefined}
            clearable
            keyboard
            format="MM/dd/yyyy" // DateFNs format.
            placeholder="mm/dd/yyyy"
            // handle clearing outside => pass plain array if you are not controlling value outside
            mask={value =>
                value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : []
            }
            disableOpenOnEnter
            value={getDateWithAddLocalOffset(value)}
            onBlur={handleBlur}
            onChange={value => { setFieldValue(name, value) }}
            {...rest}
        />
    );
}
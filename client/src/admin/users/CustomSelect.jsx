import Select from "react-select";
import { useField } from "formik";
import React, { useEffect } from "react";
export default function CustomSelect(props) {
    const [field, state, { setValue, setTouched }] = useField(props.field.name);

    // value is an array now
    const onChange = (value) => {
        setValue(value);
    };

    useEffect(() => {
        setValue(props.form.values[props.field.name])
    }, [props.form.values[props.field.name]]);

    // use value to make this a  controlled component
    return (
        <Select
            {...props}
            options={props.form.values[props.fieldOption]}
            value={state?.value}
            isMulti
            onChange={onChange}
            onBlur={setTouched}
        />
    );
}
import React from 'react';
import { TextField } from 'material-ui'

const FormField = ({ label, input, type, multiLine, rows, hintText, handleKeyEvent, meta: { error, touched } }) => {
  return (
    <div>
      <TextField
        hintText={hintText || label}
        floatingLabelText={label}
        errorText={touched && error}
        type={type}
        fullWidth={true}
        {...input}
        onKeyPress={handleKeyEvent}
        multiLine={multiLine}
        rows={rows}
      /><br />
    </div>
  );
};

export default FormField;

// src/components/users/CustomTextField.js
import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

const CustomTextField = React.forwardRef((props, ref) => {
  return <StyledTextField {...props} inputRef={ref} />;
});

export default CustomTextField;

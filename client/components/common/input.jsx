import React from 'react';
import PT from 'prop-types';

export default function Input ({
    onChange,
    label,
    name,
    type,
    value
  }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input className="form-control" name={name} id={name} value={value} onChange={onChange} type={type} />
    </div>
  );
};

Input.propTypes = {
  onChange: PT.func,
  name: PT.string.isRequired,
  type: PT.string,
  value: PT.oneOfType([PT.string, PT.number])
};

Input.defaultProps = {
  onChange: () => {},
  type: 'string'
};
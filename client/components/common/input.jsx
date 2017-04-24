import React from 'react';
import PT from 'prop-types';

export default function Input (props) {
  const {
    inputType = null,
    onChange,
    label,
    name,
    type,
    value
  } = props;

  if (inputType) {
    if (inputType === 'radio') return <Radio {...props} />
    if (inputType === 'select') return <Select {...props} />
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input className="form-control" name={name} id={name} value={value} onChange={onChange} type={type} />
    </div>
  );
};

Input.propTypes = {
  inputType: PT.oneOf(['checkbox', 'radio', 'select']),
  onChange: PT.func,
  name: PT.string.isRequired,
  type: PT.string,
  value: PT.oneOfType([PT.string, PT.number])
};

Input.defaultProps = {
  onChange: () => {},
  type: 'string'
};

function Radio ({
  options,
  onChange,
  label,
  name,
  value
}) {
  const checked = value;
  return (
    <div className="input-group">
      <label htmlFor="role">{label}</label>
      {renderButtons(options)}
    </div>
  );

  function renderButtons (buttons) {
    return buttons.map(({ value, label }) => (
      <div key={value} className="radio">
        <label>
          <input type="radio" name={name} value={value} checked={value === checked} onChange={onChange} />
          {label}
        </label>
      </div>
    ));
  }
}

function Select ({
  options,
  onChange,
  label,
  name,
  value
}) {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} className="form-control" value={value} onChange={onChange}>
        {renderOptions(options)}
      </select>
    </div>
  );

  function renderOptions (opts) {
    return opts.map(({ label, value}) => {
      return (
        <option key={value} value={value}>{label}</option>
      );
    })
  }
}
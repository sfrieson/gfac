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
    if (inputType === 'radio') return <Radio {...props} options={[
      {buttonValue: 'mobile', label: 'Mobile'},
      {buttonValue: 'office', label: 'Office'}
    ]} />
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input className="form-control" name={name} id={name} value={value} onChange={onChange} type={type} />
    </div>
  );
};

Input.propTypes = {
  inputType: PT.oneOf(['radio', 'checkbox']),
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
  return (
    <div className="input-group">
      <label htmlFor="role">{label}</label>
      {renderButtons(options)}
    </div>
  );

  function renderButtons (buttons) {
    return buttons.map(({ buttonValue, label }) => (
      <div key={buttonValue} className="radio">
        <label>
          <input type="radio" name={name} value={buttonValue} checked={buttonValue === value} onChange={onChange} />
          {label}
        </label>
      </div>
    ));
  }
}
import React from 'react';
import PT from 'prop-types';

export default function Input (props) {
  const {
    onChange,
    label,
    name,
    type = 'text',
    value
  } = props;

  if (type === 'radio') return <Radio {...props} />
  if (type === 'select') return <Select {...props} />
  if (type === 'checkbox') return <Checkbox {...props} />
  if (type === 'checkboxes') return <Checkboxes {...props} />

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input className="form-control" name={name} id={name} value={value} onChange={onChange} type={type} />
    </div>
  );
};

Input.propTypes = {
  type: PT.oneOf(['checkbox', 'checkboxes', 'radio', 'select', 'text', 'tel'/*, 'textarea'*/]),
  onChange: PT.func,
  name: PT.string.isRequired,
  type: PT.string,
  value: PT.oneOfType([PT.string, PT.number])
};

Input.defaultProps = {
  onChange: () => {},
  type: 'string'
};

// -----------
// Radio Input
// -----------

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

// ------------
// Select Input
// ------------

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
    });
  }
}

// --------------
// Checkbox Input
// --------------

function Checkbox ({label, ...props}) {
  return (
    <label>
      <input type="checkbox" {...props} />{label}
    </label>
  );
}

// ----------------
// Checkboxes Input
// ----------------

/*  Example with global name

*   <Input type='checkboxes' label='Causes' name='causes'
*     values={[1]}
*     options={[
*       {label: 'Education', value: '1'},
*       {label: 'Health', value: '2'}
*     ]}
*     />
*
*
*   Example with check-specific names
*
*   <Input type='checkboxes' label='How do you take pictures'
*     values={['cameraDSLR', 'cameraPhone']}
*     options={[
*       {label: 'Phone', name: 'cameraPhone'},
*       {label: 'DSLR', name: 'cameraDSLR'},
*       {label: 'Film', name: 'cameraFilm'},
*     ]}
*     />
* */
function Checkboxes ({
  options,
  onChange,
  label,
  name,
  value
                     }) {

  const sameName = name;
  const values = value;
  return (
    <div className="checkbox">
      {label}
      {renderChecks(options)}
    </div>
  );

  function renderChecks (checks) {
    return checks.map(({label, name, value}) => {
      return <Checkbox key={name || (sameName + value)}
                       name={name || sameName}
                       checked={values.indexOf(name || value) > -1}
                       value={value}
                       label={label}
                       onChange={onChange} />;
    });
  }
}
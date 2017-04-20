import { render } from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';

import './styles.scss';
import App from './components';
import store from './components/store/index';

render(<Provider children={App} store={store} />, document.getElementById('app'));
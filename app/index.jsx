import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

import App from './components/App/App';

setConfig({
  // removes "react-🔥-dom patch is not detected warning" in dev mode
  showReactDomPatchNotification: false
});

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  );
};

render();

if (module.hot) module.hot.accept('./components/App/App', () => { render(); });


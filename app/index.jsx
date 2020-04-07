import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

import Index from './components/App/Index';



setConfig({
  // removes "react-🔥-dom patch is not detected warning" in dev mode
  showReactDomPatchNotification: false
});

const render = () => {
  ReactDOM.render(
    <AppContainer>
        <Index />
    </AppContainer>,
    document.getElementById('root')
  );
};

render();

if (module.hot) module.hot.accept('./components/App/Index', () => { render(); });


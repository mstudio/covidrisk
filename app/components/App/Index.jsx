/**
 * Loads user details from SSO session.
 * If none found, redirects to SSO login.
 * If SSO is not required for the current path, renders App
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import RequestUtils from '../../utilities/RequestUtils';


const Index = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const loadData = () => {
    // Session
    RequestUtils.request('http://covidtracking.com/api/us', 'GET')
      .then((result) => {
        console.log('got result', result);
        setLoading(false);
      }).catch((e) => {
        // display error
      });
  };

  useEffect(() => {
    loadData();
  }, [])


  if (loading) {
    //return <LoadingMessage text="Loading data..." />;
    return <span> loading...</span>
  }

  return (
    <main role="main">
      data loaded
    </main>
  );
};

Index.propTypes = {
  location: PropTypes.object.isRequired
};

export default Index;


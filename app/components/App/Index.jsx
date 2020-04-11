/**
 * Loads user details from SSO session.
 * If none found, redirects to SSO login.
 * If SSO is not required for the current path, renders App
 */

import React, { useState, useEffect } from 'react';

import { drawDonutChart } from '../../utilities/ChartUtils';
import RequestUtils from '../../utilities/RequestUtils';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [usData, setUSData] = useState(null);

  // renders the static components and creates a group for dynamic components to be drawn
  const renderChart = (data) => {
    drawDonutChart('#chart-1', [
      { key: 'Positive', count: data.positive },
      { key: 'Negative', count: data.negative }
    ]);
  };

  const loadData = () => {
    // Session
    RequestUtils.request('/api/data/us/current', 'GET')
      .then((result) => {
        console.log('got result', result);
        setUSData(result[0]);
        setLoading(false);
        renderChart(result[0]);
      }).catch((e) => {
        // display error
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main role="main">

      {usData &&
      <React.Fragment>
        <span>Positive {usData.positive.toLocaleString()}</span>
        <span>Negative {usData.negative.toLocaleString()}</span>
      </React.Fragment>
      }
      {/* <div className="chart" id="chart-1" /> */}
      <svg className="chart" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" id="chart-1" />

      {loading && <span> loading...</span>}
    </main>
  );
};


export default Index;


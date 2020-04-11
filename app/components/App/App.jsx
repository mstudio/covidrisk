/**
 * Loads user details from SSO session.
 * If none found, redirects to SSO login.
 * If SSO is not required for the current path, renders App
 */

import React, { useState, useEffect } from 'react';

import { drawDonutChart, drawBarChart } from '../../utilities/ChartUtils';
import RequestUtils from '../../utilities/RequestUtils';

import './App.scss';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const dataSet = {};


  // renders the static components and creates a group for dynamic components to be drawn
  const renderCharts = () => {
    if (!data) return;
    drawDonutChart('#donut-chart-1', [
      { key: 'Positive', value: data.positive },
      { key: 'Negative', value: data.negative }
    ]);
    drawBarChart('#bar-chart-1', [
      { key: 'Positive', value: data.positive },
      { key: 'Negative', value: data.negative }
    ]);
  };

  const loadData = () => {
    // For testing only
    setData({
      positive: 10000,
      negative: 10000
    });
    setLoading(false);

    // Actual Data
    // RequestUtils.request('/api/data/us/current', 'GET')
    //   .then((result) => {
    //     setData(result[0]);
    //     setLoading(false);
    //   }).catch((e) => {
    //     // display error
    //   });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    renderCharts();
  }, [data]);

  return (
    <main role="main" className="main bx">
      <header className="bx--row">
        <h1>Covid-19 Risk</h1>
      </header>
      <section className="bx--row" />

      {data &&
      <React.Fragment>
        <span>Positive {data.positive.toLocaleString()}</span>
        <span>Negative {data.negative.toLocaleString()}</span>
      </React.Fragment>
      }
      {/* <div className="chart" id="chart-1" /> */}
      <svg className="chart chart--donut" id="donut-chart-1" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
      <svg className="chart chart--bar" id="bar-chart-1" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />


      {loading && <span> loading...</span>}
    </main>
  );
};


export default App;


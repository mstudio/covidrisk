/**
 * Loads user details from SSO session.
 * If none found, redirects to SSO login.
 * If SSO is not required for the current path, renders App
 */

import React, { useState, useEffect } from 'react';

import { drawDonutChart, drawBarChart } from '../../utilities/ChartUtils';
import RequestUtils from '../../utilities/RequestUtils';

import '../../css/app.scss';
import './App.scss';
import { getPercent } from '../../utilities/MathUtils';

const US_POPULATION = 329968629;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const dataSet = {};

  // renders the static components and creates a group for dynamic components to be drawn
  const renderCharts = () => {
    if (!data) return;


    drawDonutChart('#donut-chart-1', [
      { key: 'Positive', value: data.totalTestResults },
      { key: 'Negative', value: US_POPULATION - data.totalTestResults }
    ]);
    drawBarChart('#bar-chart-1', [
      { key: 'Positive', value: data.totalTestResults },
      { key: 'Negative', value: US_POPULATION - data.totalTestResults }
    ]);


    drawDonutChart('#donut-chart-2', [
      { key: 'Positive', value: data.positive },
      { key: 'Negative', value: data.negative }
    ]);
    drawBarChart('#bar-chart-2', [
      { key: 'Positive', value: data.positive },
      { key: 'Negative', value: data.negative }
    ]);


    drawDonutChart('#donut-chart-3', [
      { key: 'Positive', value: data.hospitalizedCumulative },
      { key: 'Negative', value: data.positive - data.hospitalizedCumulative  }
    ]);
    drawBarChart('#bar-chart-3', [
      { key: 'Positive', value: data.hospitalizedCumulative },
      { key: 'Negative', value: data.positive - data.hospitalizedCumulative }
    ]);

    drawDonutChart('#donut-chart-4', [
      { key: 'Positive', value: data.death },
      { key: 'Negative', value: data.positive - data.death  }
    ]);
    drawBarChart('#bar-chart-4', [
      { key: 'Positive', value: data.death },
      { key: 'Negative', value: data.positive - data.death }
    ]);
  };

  const loadData = () => {
    // For testing only
    // setData({
    //   positive: 442300,
    //   negative: 1601400,
    //   totalTestResults: 292929292
    // });
    // setLoading(false);

    // Actual Data
    RequestUtils.request('/api/data/us/current', 'GET')
      .then((result) => {
        setData(result[0]);
        setLoading(false);
      }).catch((e) => {
        // display error
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    renderCharts();
  }, [data]);

  return (
    <main role="main" className="page bx">
      <header className="intro--header">
        <h1>Covid-19 Risk in the U.S.</h1>
        <p>The media in the U.S. has focused on <a href="https://www.nytimes.com/interactive/2020/03/13/world/asia/coronavirus-death-life.html" target="_blank">stories</a> of <a href="https://www.nytimes.com/2020/03/27/sunday-review/coronavirus-hospitalized.html" target="_blank">outliers</a>: people with no underlying conditions who have had serious complications or died from Covid-19. The actual data paints a somewhat different picture.</p>
        <p>This page is in no way meant to encourage people to stop social distancing, or reopen businesses. Instead, it's meant to show the risk of danger from Covid-19, and perhaps cause a little less anxiety about it.</p>
        <p>A note about the data...</p>

      </header>

      {data &&
      <React.Fragment>
        <header className="chart--header">
          <h2>{getPercent(data.totalTestResults, US_POPULATION)} of the U.S. has been tested.</h2>
          <caption className="caption">
            <span className="caption--a">Tested: {data.totalTestResults.toLocaleString()}</span>
            <span className="caption--b">Untested: {(US_POPULATION - data.totalTestResults).toLocaleString()}</span>
          </caption>
          <span className="note">Total Estimated Population: {US_POPULATION.toLocaleString()}</span>
        </header>
      </React.Fragment>
      }
      {/* <div className="chart" id="chart-1" /> */}
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-1" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <svg className="chart chart--bar" id="bar-chart-1" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
      </section>

      {data &&
      <React.Fragment>
        <header className="chart--header">
          <h2>{getPercent(data.positive, data.positive + data.negative)} of those tested were positive.</h2>
          <caption className="caption">
            <span className="caption--a">Positive: {data.positive.toLocaleString()}</span>
            <span className="caption--b">Negative: {data.negative.toLocaleString()}</span>
          </caption>
          <span className="note">Total Test Results: {data.totalTestResults.toLocaleString()}</span>
        </header>
      </React.Fragment>
      }
      {/* <div className="chart" id="chart-1" /> */}
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-2" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <svg className="chart chart--bar" id="bar-chart-2" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
      </section>


      {data &&
      <React.Fragment>
        <header className="chart--header">
          <h2>{getPercent(data.hospitalizedCumulative, data.positive)} of those who tested positive were hospitalized.</h2>
          <caption className="caption">
            <span className="caption--a">Hospitalized: {data.hospitalizedCumulative.toLocaleString()}</span>
            <span className="caption--b">Postitive Cases: {data.positive.toLocaleString()}</span>
          </caption>
        </header>
      </React.Fragment>
      }
      {/* <div className="chart" id="chart-1" /> */}
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-3" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <svg className="chart chart--bar" id="bar-chart-3" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
      </section>


      {data &&
      <React.Fragment>
        <header className="chart--header">
          <h2>{getPercent(data.death, data.positive)} of those who tested positive died.</h2>
          <caption className="caption">
            <span className="caption--a">Deaths: {data.death.toLocaleString()}</span>
            <span className="caption--b">Postitive Cases: {data.positive.toLocaleString()}</span>
          </caption>
        </header>
      </React.Fragment>
      }
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-4" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <svg className="chart chart--bar" id="bar-chart-4" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
      </section>



      {loading && <span> loading...</span>}
    </main>
  );
};


export default App;


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
//               pop,     tested,     positive,   hospitalized, death
const colors = ['#b4b7b9', '#4682b4', '#46b45d', '#e3d932', '#b22024'];
const populationColor = '#e8ae31';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // renders the static components and creates a group for dynamic components to be drawn
  const renderCharts = () => {
    if (!data) return;

    drawDonutChart('#donut-chart-1', [data.totalTestResults, US_POPULATION - data.totalTestResults], [colors[1], colors[0]]);
    drawBarChart('#bar-chart-1', [data.totalTestResults, US_POPULATION], [colors[1], populationColor]);

    drawDonutChart('#donut-chart-2', [data.positive, data.negative], [colors[1], colors[0]]);
    drawBarChart('#bar-chart-2', [data.positive, US_POPULATION], [colors[1], populationColor]);

    // drawDonutChart('#donut-chart-3', [data.hospitalizedCumulative, data.positive - data.hospitalizedCumulative], [colors[1], colors[0]]);
    // drawBarChart('#bar-chart-3', [data.hospitalizedCumulative, data.positive - data.hospitalizedCumulative], [colors[1], populationColor]);

    drawDonutChart('#donut-chart-4', [data.death, data.positive - data.death], [colors[1], colors[0]]);
    drawBarChart('#bar-chart-4', [data.death, US_POPULATION], [colors[1], populationColor]);
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
        <h1>COVID-19 Risk in the U.S.</h1>
        <p>Some news stories in the U.S. have focused on <a href="https://www.nytimes.com/2020/03/27/sunday-review/coronavirus-hospitalized.html" target="_blank">outliers</a>: people with no underlying conditions who have had serious complications or <a href="https://www.nytimes.com/interactive/2020/03/13/world/asia/coronavirus-death-life.html" target="_blank">died from COVID-19</a>. The actual data paints a somewhat different picture.</p>
        <p>This page is in no way meant to encourage people to stop social distancing, or reopen businesses. Instead, it's meant to show the risk of danger from COVID-19, and maybe reduce the amount of anxiety around it.</p>
        <p>The data used for thes charts is supplied by <a href="https://covidtracking.com/" target="_blank">The COVID Tracking Project</a></p>

  {data && <p><em>Data last updated {new Date(data.lastModified).toTimeString()}</em></p>}

      </header>

      {data &&
      <React.Fragment>
        <header className="chart--header">
          <h2>{getPercent(data.totalTestResults, US_POPULATION)} of the U.S. has been tested.</h2>
          <div className="caption">
            <span className="caption--a">Tested: {data.totalTestResults.toLocaleString()}</span>
            <span className="caption--b">Untested: {(US_POPULATION - data.totalTestResults).toLocaleString()}</span>
            <span className="caption--c">Total Est. Population: {US_POPULATION.toLocaleString()}</span>
          </div>
        </header>
      </React.Fragment>
      }
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
            <span className="caption--c">Total Est. Population: {US_POPULATION.toLocaleString()}</span>
          </caption>
          <span className="note">Total Test Results: {data.totalTestResults.toLocaleString()}</span>
        </header>
      </React.Fragment>
      }
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-2" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <article>
          {data && <h2>That's <em>{getPercent(data.positive, US_POPULATION, 5)}</em> of the U.S. population</h2>}
          <svg className="chart chart--bar" id="bar-chart-2" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        </article>
      </section>


      {/* {data &&
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
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-3" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <svg className="chart chart--bar" id="bar-chart-3" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
      </section> */}


      {data &&
      <React.Fragment>
        <header className="chart--header">
          <h2>{getPercent(data.death, data.positive)} of those who tested positive died.</h2>
          <caption className="caption">
            <span className="caption--a">Deaths: {data.death.toLocaleString()}</span>
            <span className="caption--b">Postitive Cases: {data.positive.toLocaleString()}</span>
            <span className="caption--c">Total Est. Population: {US_POPULATION.toLocaleString()}</span>
          </caption>
        </header>
      </React.Fragment>
      }
      <section className="bx--row chart-container">
        <svg className="chart chart--donut" id="donut-chart-4" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        <article>
          {data && <h2>That's <em>{getPercent(data.death, US_POPULATION, 5)}</em> of the U.S. population</h2>}
          <svg className="chart chart--bar" id="bar-chart-4" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" viewBox="0 0 540 540" />
        </article>
      </section>


      {loading && <span> loading...</span>}
    </main>
  );
};


export default App;


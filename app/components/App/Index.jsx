/**
 * Loads user details from SSO session.
 * If none found, redirects to SSO login.
 * If SSO is not required for the current path, renders App
 */

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import ChartUtils from '../../utilities/ChartUtils';
import RequestUtils from '../../utilities/RequestUtils';


const Index = () => {
  const [loading, setLoading] = useState(true);
  let svg;
  let g;

  // renders the static components and creates a group for dynamic components to be drawn
  const renderChart = () => {
    svg = d3.select('svg.chart');
    ChartUtils.renderChartBG(this.svg, this.props.width, this.props.height, this.props.margin);
    ChartUtils.renderKeyBG(this.svg, this.props.width, this.props.height, this.props.margin, this.props.keyDimensions);
    g = svg.append('g'); // main group for dynamic components of the chart
  };

  const loadData = () => {
    // Session
    RequestUtils.request('//covidtracking.com/api/us', 'GET')
      .then((result) => {
        console.log('got result', result);
        setLoading(false);
        renderChart();
      }).catch((e) => {
        // display error
      });
  };

  useEffect(() => {
    loadData();
  }, []);


  if (loading) {
    // return <LoadingMessage text="Loading data..." />;
    return <span> loading...</span>;
  }

  return (
    <main role="main">
      data loaded
      <svg className="chart" />
    </main>
  );
};


export default Index;


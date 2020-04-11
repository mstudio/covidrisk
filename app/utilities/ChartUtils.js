/**
 * d3 Charting line drawing, scaling etc
 */
import * as d3 from 'd3';

export const drawBarChart = (selector, data) => {
  const width = 540;
  const height = 540;
  const margin = ({
    top: 30, right: 0, bottom: 30, left: 80
  });
  const svg = d3.select(selector);

  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

  const yAxis = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, data.format).tickSizeInner(-width))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', -margin.left)
      .attr('y', 10)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text(data.y));

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  svg.append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d, i) => x(i))
    .attr('y', d => y(d.value))
    .attr('height', d => y(0) - y(d.value))
    .attr('width', x.bandwidth());

  

  // const numberOfTicks = 6;

  // const xAxisGrid = xAxis.ticks(numberOfTicks)
  //   .tickSize(-height, 0)
  //   .tickFormat('')
  //   .orient('top');

  // svg.append('g')
  //   .classed('x', true)
  //   .classed('grid', true)
  //   .call(xAxisGrid);
};

export const drawDonutChart = (selector, data) => {
  const width = 540;
  const height = 540;
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius / 1.5;

  const svg = d3.select(selector)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal(['#2872c4', '#99e3ff']);

  const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return t => arc(i(t));
  }

  function update() {
    // Join new data
    const path = svg.selectAll('path')
      .data(pie(data));

    // Update existing arcs
    path.transition().duration(200).attrTween('d', arcTween);

    // Enter new arcs
    path.enter().append('path')
      .attr('fill', (d, i) => color(i))
      .attr('d', arc)
      .each(function(d) { this._current = d; });
  }

  const percent = Math.round((data[0].value / (data[0].value + data[1].value)) * 100);

  svg.append('g')
    .attr('text-anchor', 'middle')
    .append('text')
    .text(`${percent}%`)
    .attr('class', 'title');


  update();
  // });
};

export const foo = () => {};

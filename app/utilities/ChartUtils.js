/**
 * d3 Charting line drawing, scaling etc
 */
import * as d3 from 'd3';

export const drawDonutChart = (selector, data) => {
  const width = 540;
  const height = 540;
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius / 1.5;

  const svg = d3.select(selector)
    // .append('svg')
    // .attr('width', '100%')
    // .attr('height', '100%')
    // .attr('preserveAspectRatio', 'xMinYMin meet')
    // .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal(['#2872c4', '#99e3ff']);

  const pie = d3.pie()
    .value(d => d.count)
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
    // .attr('stroke', 'white')
    // .attr('stroke-width', '6px')
      .each(function(d) { this._current = d; });
  }

  // add text
  // svg.append('text')
  //   .attr({
  //     x: radius,
  //     y: radius,
  //     'text-anchor': 'middle'
  //   })
  //   .text('30%');

  const percent = Math.round((data[0].count / (data[0].count + data[1].count)) * 100);

  console.log('data', percent);

  svg.append('g')
    .attr('text-anchor', 'middle')
    .append('text')
    .text(`${percent}%`)
    .attr('class', 'title');


  update();
  // });
};

export const foo = () => {};

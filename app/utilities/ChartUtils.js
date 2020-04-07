/**
 * d3 Charting line drawing, scaling etc
 */
import * as d3 from 'd3';

class ChartUtils {
  static generateLines(g, xScale, yScale, data, type = 'future') {
    const lines = g.selectAll(`.${type}`).data(data);

    const indexOffset = (type === 'future') ? 1 : 0;
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d, i) => xScale(i + indexOffset))
      .y((d, i) => yScale(d.value));


    // transition from previous paths to new paths
    lines.transition().duration(750)
      .attr('d', line);

    // enter any new data
    lines.enter()
      .append('path')
      .attr('fill', 'none')
      .attr('d', line)
      .attr('class', (d, i) => `line line-${i} ${type}`)
      .style('fill-opacity', 1e-6)
      .style('stroke-opacity', 1e-6)
      .attr('vector-effect', 'non-scaling-stroke')
      .transition()
      .duration(1500)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1);
    // exit
    lines.exit()
      .style('fill-opacity', 1)
      .style('stroke-opacity', d => 1)
      .transition()
      .duration(1300)
      .style('fill-opacity', 1e-6)
      .style('stroke-opacity', 1e-6)
      .remove();
  }

  static generateCircles(g, xScale, yScale, data, className, type) {
    const t = d3.transition()
      .duration(750);

    // JOIN new data with old elements.
    const indexOffset = (type === 'future') ? 1 : 0;
    const circle = g.selectAll(`.dot.${className}`)
      .data(data);

    // EXIT old elements not present in new data.
    circle.exit()
      .transition(t)
      .style('fill-opacity', 1e-6)
      .style('stroke-opacity', 1e-6)
      .remove();

    // UPDATE old elements present in new data.
    circle
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
      .transition(t)
      .attr('cx', (d, i) => xScale(i + indexOffset))
      .attr('cy', (d, i) => yScale(d.value))
      .attr('r', 5);

    // ENTER new elements present in new data.
    circle.enter().append('circle')
      .attr('class', (d, i) => {
        const c = (i === 0 && type === 'future') ? 'hidden' : '';
        return `dot ${className} ${type} dot-${i} ${c}`;
      })
      .attr('cx', (d, i) => xScale(i + indexOffset))
      .attr('cy', (d, i) => yScale(d.value))
      .attr('vector-effect', 'non-scaling-stroke')
      .style('fill-opacity', 1e-6)
      .style('stroke-opacity', 1e-6)
      .attr('r', 5)
      .transition(t)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1);
  }

  static renderChartBG(svg, width, height, margin) {
    const innerDimensions = ChartUtils.getInnerDimensions(width, height, margin);

    // white bg
    svg.append('rect')
      .attr('class', 'chart-bg')
      .attr('width', innerDimensions.w)
      .attr('height', innerDimensions.h)
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('vector-effect', 'non-scaling-stroke');

    // vertical lines
    for (let index = 1; index <= 4; index++) {
      const x = margin.left + (innerDimensions.w * (index * 0.2));
      svg.append('line')
        .attr('class', 'vertical-line')
        .attr('x1', x)
        .attr('y1', margin.top)
        .attr('x2', x)
        .attr('y2', height - margin.bottom)
        .attr('vector-effect', 'non-scaling-stroke');
    }
  }

  static renderKeyBG(svg, width, height, margin, key) {
    const innerDimensions = ChartUtils.getInnerDimensions(width, height, margin);
    svg.append('rect')
      .attr('class', 'key-bg')
      .attr('width', innerDimensions.w)
      .attr('height', key.height)
      .attr('x', margin.left)
      .attr('y', key.y)
      .attr('vector-effect', 'non-scaling-stroke');
  }

  static getInnerDimensions(width, height, margin) {
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    return { w, h };
  }

  static getXScale(data, width, margin) {
    return d3.scaleTime()
      .domain([0, 5])
      .range([margin.left, width - margin.right]);
  }

  static getYScale(data, height, margin) {
    const yMax = d3.max(data, array => d3.max(array, d => d.value));
    return d3.scaleLinear()
      .domain([0, yMax])/* .nice(1) */
      .range([height - margin.bottom, margin.top]);
  }

  static buildYAxis(svg, yScale) {
    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
      .tickFormat(d3.format('.2s'));

    svg.append('g')
      .attr('class', 'y-axis axis')
      .attr('transform', `translate(${40},0)`)
      .call(yAxis);

    return yAxis;
  }
}

export default ChartUtils;

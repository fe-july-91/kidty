import { scaleLinear,scaleBand, max, extent, area, axisBottom } from 'd3';
import * as d3 from "d3";
import { months } from '../../Utils/kit';
import { sortDataByMonth } from '../../Shared/hendlers/sortDataByMoonth';

export function DrowLineChart(
  SVG,
  data,
  height,
  width,
  margin,
  targetMonth,
  slider,
  HandleGraph,
) {

  const xScale = scaleBand()
  .domain(months.map(m => m))
  .range([0, width])
  .padding(0.4);
  
  const yScale = scaleLinear()
    .domain(extent([0, max(data, d => d.value) + 3]))
    .nice()
    .range([height - margin, margin * 2]);

  sortDataByMonth(data);

  // Create groups for area, line, and points
  const areaGroup = SVG.selectAll('.area-group');
  const pointGroup = SVG.selectAll('.point-group');

  // Remove and append new area group
  areaGroup.remove();
  const newAreaGroup = SVG.append('g').attr('class', 'area-group');

  // Add area
  const areaGenerator = area()
    .x(d => xScale(d.month) + xScale.bandwidth() / 2)
    .y0(yScale(0)) // Base line of the area
    .y1(d => yScale(d.value))
    .curve(d3.curveLinear);

  newAreaGroup.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', areaGenerator)
    .attr('fill', '#50C3F9') // Area color
    .attr('opacity', 0.3);

  // Remove and append new point group
  pointGroup.remove();
  const newPointGroup = SVG.append('g').attr('class', 'point-group');

  // Add points
  const points = newPointGroup.selectAll('.point')
    .data(data);

  // Enter
  points.enter()
    .append('circle')
    .attr('class', 'point')
    .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.value))
    .attr('r', 8) // Radius of the points
    .attr('fill', d =>
      d.month === targetMonth
        ? '#FF5C9D'
        : '#50C3F9'
    )
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      HandleGraph(d);
    });

  // Update
  points
    .transition()
    .duration(700)
    .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('cy', d =>
      slider > 0 && d.month === targetMonth
        ? yScale(slider)
        : yScale(d.value)
    )
    .attr('r', 8) // Radius of the points
    .attr('fill', d =>
      d.month === targetMonth
        ? '#FF5C9D'
        : '#50C3F9'
    );

  // Exit
  points.exit().remove();

  // Add labels
  const labels = SVG.selectAll('.label')
    .data(data);

  // Enter
  labels.enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.value) - 10) // Adjust vertical position
    .attr('text-anchor', 'middle')
    .attr('fill', d =>
      d.month === targetMonth
        ? '#FF5C9D'
        : '#625F6C'
    )
    .text(d =>
      slider > 0 && d.month === targetMonth
        ? slider
        : d.value);

  // Update
  labels
    .transition()
    .duration(500)
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.value) - 10) // Adjust vertical position
    .attr('fill', d =>
      d.month === targetMonth
        ? '#FF5C9D'
        : '#625F6C'
    )
    .text(d =>
      slider > 0 && d.month === targetMonth
        ? slider
        : d.value);

  // Exit
  labels.exit().remove();

    // Добавляем ось X
  SVG.selectAll('.x-axis').remove();
  const xAxisGroup = SVG.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0,${height - margin})`)
  .call(axisBottom(xScale).tickFormat(d => d.slice(0, 3)))
  .selectAll('text') 
  .style('font-size', '12px')
  .style('cursor', 'pointer');
  xAxisGroup
    .style('fill', d => d === targetMonth ? '#FF5C9D' : '#625F6C')
    .on('click', (event, m) => {
      const targetMonthData = data.find(item => item.month === m)
      if (targetMonthData) {
        HandleGraph({ month: m, value: targetMonthData.value});
      } else {
        HandleGraph({ month: m, value: 0});
      }
    });
}
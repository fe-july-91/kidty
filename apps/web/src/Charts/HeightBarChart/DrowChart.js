import { scaleLinear,scaleBand, max, extent,axisBottom} from 'd3';
import { months } from "../../Utils/kit";
import { sortDataByMonth } from '../../Shared/hendlers/sortDataByMoonth';

export function DrawChart(
  SVG,
  data,
  height,
  width,
  margin,
  selectedMonth,
  slider,
  HandleGraph,
) {
  sortDataByMonth(data);

  const xScale = scaleBand()
  .domain(months.map((m) => m))
  .range([0, width - margin])
  .padding(0.5);
  
  const yScale = scaleLinear()
    .domain(extent([0, max(data, d => d.value) + 3]))
    .nice()
    .range([height - margin, margin * 2]);


 // Create bars
  const bars = SVG.selectAll('.bar').data(data, d => d.id);

// Enter - Add new bars with animation
const barsEnter = bars.enter()
.append('rect')
.attr('class', 'bar')
.attr('x', d => xScale(d.month))
.attr('y', d => yScale(0)) // Start from the bottom of the chart
.attr('width', xScale.bandwidth())
.attr('height', 0) // Start with height 0
.attr('fill', d =>
  d.month === selectedMonth
    ? '#FF5C9D'
    : '#50C3F9'
)
.attr('rx', '10')
.attr('ry', '10')
.style('cursor', 'pointer')
.on('click', (event, d) => {
  HandleGraph(d);
});

barsEnter
.transition()
.duration(500)
.attr('y', d => yScale(d.value)) // Animate to the final y position
.attr('height', d => height - margin - yScale(d.value)); // Animate to the final height

// Update existing bars without animation
bars.transition()
.duration(0) // Remove transition to avoid animating all bars
.attr('x', d => xScale(d.month))
.attr('y', d =>
  slider > 0 && d.month === selectedMonth
    ? yScale(slider)
    : yScale(d.value)
)
.attr('width', xScale.bandwidth())
.attr('height', d =>
  slider > 0 && d.month === selectedMonth
    ? height - margin - yScale(slider)
    : height - margin - yScale(d.value)
)
.attr('fill', d =>
  d.month === selectedMonth
    ? '#FF5C9D'
    : '#50C3F9'
)
.attr('rx', '10')
.attr('ry', '10');


// Exit
  bars.exit().remove();
  
  // Add labels
  const labels = SVG.selectAll('.label').data(data);

  // Enter
  labels.enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.value) - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', d =>
      d.month.toLowerCase() === selectedMonth.toLowerCase()
        ? '#FF5C9D'
        : '#625F6C'
    )
    .text(d =>
      slider > 0 && d.month === selectedMonth
        ? slider
        : d.value);

  // Update
  labels
    .transition()
    .duration(100)
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d =>
      slider > 0 && d.month === selectedMonth
        ? yScale(slider) - 5
        : yScale(d.value) - 5
    )
    .attr('fill', d =>
      d.month.toLowerCase() === selectedMonth.toLowerCase()
        ? '#FF5C9D'
        : '#625F6C'
    )
    .text(d =>
      slider > 0 && d.month === selectedMonth
        ? slider
        : d.value);

  // Exit
  labels.exit().remove();
  
  // Добавляем ось X
SVG.selectAll('.x-axis').remove();
const xAxisGroup = SVG.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0,${height - margin})`)
  .call(axisBottom(xScale).tickFormat(m => m.slice(0, 3)))
  .selectAll('text') 
  .style('font-size', '12px')
  .style('cursor', 'pointer')

xAxisGroup
  .style('fill', m => m === selectedMonth ? '#FF5C9D' : '#625F6C')
  .on('click', (event, m) => {
    const targetMonthData = data.find(item => item.month === m)
    if (targetMonthData) {
      HandleGraph({ month: m, value: targetMonthData.value});
    } else {
      HandleGraph({ month: m, value: 0});
    }
  });
}

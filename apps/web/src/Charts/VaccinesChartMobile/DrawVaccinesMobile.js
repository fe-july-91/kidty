import { scaleBand, axisBottom, axisLeft, scalePoint } from 'd3';
import { vaccinTypes } from '../../Utils/kit';
import { getAgeAtVaccination } from '../../Shared/hendlers/VactinationAge';

export function DrawVaccinesMobile(
  SVG,
  data,
  height,
  width,
  margin,
  targeVaccine,
  selectedVaccine,
  updatedVaccine,
  birth,
  HandleGraph,
  activeBatton,
  handleVaccineclick
) {

  const marginLeft = margin + 12;
  const marginGrahp = margin;

  let age = "";

  if (targeVaccine) {
    age = getAgeAtVaccination(targeVaccine.date,birth)
  }

  const xData = data.map(d => d.date);
  const uniqueXData = [...new Set(xData)]
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('-');
      const [dayB, monthB, yearB] = b.split('-');
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateA - dateB;
    });

  const newVaccine = (d) => {
    return updatedVaccine && d.type === updatedVaccine.type && d.date === updatedVaccine.date
  }
  const uniqueAgeData = uniqueXData.map((d, i) => ({
    age: getAgeAtVaccination(d, birth),
    index: i
  }));
    
  // X
  const xScale = scalePoint()
    .domain(uniqueXData)
    .range([marginLeft, width])
    .padding(0.5);
  
    //Y
    const yScale = scaleBand()
    .domain(vaccinTypes)
    .range([height - marginGrahp, margin])
    .padding(0.4);
  
    const ageScale = scaleBand()
    .domain(uniqueAgeData.map(d => `${d.age}-${d.index}`))
    .range([marginLeft, width])
      .padding(0.4);
  
  SVG.selectAll('.age-axis').remove();

  const ageAxisGroup = SVG.append('g')
    .attr('class', 'age-axis')
    .attr('transform', `translate(0, ${0})`)
    .call(axisBottom(ageScale).tickFormat(d => d.split('-')[0]));
  
  ageAxisGroup.selectAll('path').remove();
  ageAxisGroup.selectAll('line').remove();

    ageAxisGroup.selectAll('text')
      .style('font-size', '12px')
      .style('fill',a => age && a === age ? '#FF5C9D' : '#C88CF8')
    .style('text-anchor', 'middle')
  
SVG.selectAll('.age-lines').remove();
SVG.append('g')
  .attr('class', 'age-lines')
  .selectAll('line')
  .data(data)
  .enter()
  .append('line')
  .attr('x1',  d => xScale(d.date))
  .attr('x2', d => xScale(d.date))
  .attr('y1', marginGrahp + 15)
  .attr('y2', height - marginGrahp)
  .style('stroke', d => targeVaccine && d.date === targeVaccine.date ? '#FF5C9D': '#a6aeb7')
  .style('stroke-width', '1px')
  .style('stroke-dasharray', '4 4');

SVG.selectAll('.horizontal-lines').remove();
SVG.append('g')
  .attr('class', 'horizontal-lines')
  .selectAll('line')
  .data(vaccinTypes)
  .enter()
  .append('line')
  .attr('x1', marginLeft)
  .attr('x2', width)
  .attr('y1', d => yScale(d) + yScale.bandwidth() / 2)
  .attr('y2', d => yScale(d) + yScale.bandwidth() / 2)
  .style('stroke', d => targeVaccine && d === targeVaccine.type ? '#FF5C9D': '#a6aeb7')
  .style('stroke-width', '1.5px')
  .style('stroke-dasharray', '4 4');
  
// X
SVG.selectAll('.x-axis').remove();
  const xAxisGroup = SVG.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - marginGrahp})`)
    .call(axisBottom(xScale).tickFormat(d => d.slice(0, 6) + d.slice(8)))
    .selectAll('text')
    .style('font-size', '12px')
    .style('text-anchor', 'middle');
  xAxisGroup.style('cursor', 'pointer');

  // Y
  SVG.selectAll('.y-axis').remove();
  const yAxisGroup = SVG.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${marginLeft}, 0)`)
    .call(axisLeft(yScale).tickFormat(m => m.slice(0, 3)))
    .selectAll('text')
    .style('font-size', '12px')
    .style('letter-spacing', '-0.6px')
    .style('fill', d => d === selectedVaccine & activeBatton ? '#FF5C9D' :'#42456C')
    .style('font-weight', '400')
    .style('text-rendering', 'optimizeLegibility')
    .on('click', (event, d) => {
      handleVaccineclick(d);
    })

  yAxisGroup.selectAll('.tick line')
    .style('stroke', '#625F6C')
    .style('stroke-width', '1px');

    // SVG.selectAll().remove()

 // Remove old points and labels
 SVG.selectAll('.point').remove();
 SVG.selectAll('.point-label').remove();

const points = SVG.selectAll('.point')
.data(data.filter(d => vaccinTypes.includes(d.type)), d => d.date + d.type); // Фильтруем только валидные типы

// Enter new points
points.enter()
  .append('circle')
  .attr('class', 'point')
  .attr('cx', d => xScale(d.date))
  .attr('cy', d => yScale(d.type) + yScale.bandwidth() / 2)
  .attr('r', d => newVaccine(d) ? 0 : 16 ) // Start with a radius of 0 for the animation
  .attr('fill', d => d === targeVaccine ? '#FF5C9D' : '#C88CF8')
  .style('cursor', 'pointer')
  .on('click', (event, d) => {
    HandleGraph(d);
  })
  .transition()
  .duration(600)
  .attr('r', 16) // Start with a radius of 0 for the animation

// Update existing points
points.transition()
  .duration(600)
  .attr('cx', d => xScale(d.date))
  .attr('cy', d => yScale(d.type) + yScale.bandwidth() / 2)
  .attr('fill', d => d === targeVaccine ? '#FF5C9D' : '#C88CF8')

// Remove exiting points
points.exit()
  .transition()
  .duration(600)
  .attr('r', 0 ) // Start with a radius of 0 for the animation
  .remove();


const labels = SVG.selectAll('.point-label')
.data(data, d => d.type + d.date); // Key function to uniquely identify

// Enter new labels
labels.enter()
.append('text')
.attr('class', 'point-label')
.attr('x', d => xScale(d.date))
.attr('y', d => yScale(d.type) + yScale.bandwidth() / 2)
.attr('dy', '.35em')
.attr('text-anchor', 'middle')
.style('fill', '#fff')
.style('font-size', '14px')
.style('cursor', 'pointer')
.style('user-select', 'none')
.text((d) => {
  const index = data
    .filter(v => v.type === d.type)
    .map(d => d.date)
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('-');
      const [dayB, monthB, yearB] = b.split('-');
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateA - dateB;
        })
    .findIndex(i => i === d.date) 

  return index < 0 ? 1 : index + 1
})
.style('opacity', 1)
.on('click', (event, d) => {
  HandleGraph(d);
})

// Update existing labels
labels.transition()
.duration(600)
.attr('x', d => xScale(d.date))
.attr('y', d => yScale(d.type) + yScale.bandwidth() / 2)
.text(d => d.orderNumber);

// Remove exiting labels
labels.exit()
.transition()
.duration(600)
.style('opacity', 0) // Animate to opacity 0 before removing
.remove();
}
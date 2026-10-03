import * as d3 from "d3";

export function DrawEyesChart(
  SVG, 
  width,
  arcColor,
  height,
  margin,
  sliderValue,
  xOffset = 0
) {
  const minValue = -10;
  const maxValue = 12;

  // const arcColorFn = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))

 const radius = Math.min(width, height) / 2 - margin - 4;
  // Найти или создать контейнер для диаграммы
  let chartGroup = SVG.select(`g.chartGroup-${xOffset}`);
  if (chartGroup.empty()) {
    chartGroup = SVG.append("g")
      .attr("class", `chartGroup-${xOffset}`)
      .attr("transform", `translate(${width / 2 + xOffset}, ${height - margin})`);
  }

  // Очистка всех предыдущих элементов в chartGroup перед отрисовкой
  chartGroup.selectAll("*").remove();

// Настройка шкалы
const arcScale = d3.scaleLinear()
 .domain([minValue, maxValue])
 .range([-Math.PI / 2, Math.PI / 2]);

// Создание арки
const arc = d3.arc()
 .innerRadius(radius - 40)
 .outerRadius(radius)
 .startAngle(arcScale(minValue))
 .endAngle(arcScale(maxValue));

// Добавление арки в SVG
chartGroup.append('path')
 .attr('d', arc)
  .attr('fill', arcColor);

// Настройка шкалы для указателя
const pointerScale = d3.scaleLinear()
 .domain([minValue, maxValue])
  .range([-Math.PI / 2, Math.PI / 2]);
  

// Добавление указателя
const pointerAngle = pointerScale(sliderValue);

const lineData = [
 [0, 0],
 [0, -radius - 8]
];

const lineGenerator = d3.line()
 .x(d => d[0])
 .y(d => d[1])
 .curve(d3.curveLinear);

chartGroup.append('path')
  .attr('d', lineGenerator(lineData))
  .attr('class', 'pointer')
 .attr('stroke', '#42456C')
 .attr('stroke-width', 1.5)
 .attr('transform', `rotate(${pointerAngle * 180 / Math.PI})`);

// Добавление меток на шкале
const ticks = d3.range(minValue, maxValue + 1);

chartGroup.selectAll('text')
 .data(ticks)
 .enter()
 .append('text')
 .attr('x', d => Math.cos(arcScale(d) - Math.PI / 2) * (radius + 16))
 .attr('y', d => Math.sin(arcScale(d) - Math.PI / 2) * (radius + 16))
 .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('font-size', '12px')
  .style('letter-spacing', '-0.6px') // уменьшение межбуквенного расстояния
  .attr('fill', '#42456C')
  .text(d => d.toString());
  
  // Добавление points на шкале
const pointTicks = d3.range(minValue, maxValue + 1);

  chartGroup.selectAll('.point')
    .data(pointTicks)
    .enter()
    .append('circle')
    .attr('class', 'point')
    .attr('cx', d => Math.cos(arcScale(d) - Math.PI / 2) * (radius + 6))
    .attr('cy', d => Math.sin(arcScale(d) - Math.PI / 2) * (radius + 6))
    .attr('alignment-baseline', 'middle')
    .attr('fill', arcColor)
    .attr('r', 2);
}

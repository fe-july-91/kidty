import React, { useEffect, useRef } from "react";
import { select, scaleBand, axisBottom } from "d3";
import * as d3 from "d3";
import { DrowFootChart } from "./DrowFootChart";

export const FootChart = ({
  width,
  height,
  data,
  selectedMonth,
  slider = 0,
  HandleGraph,
}) => {
  

  const margin = 24;
  const xAxisRef = useRef(null);
  const rectRef = useRef();

  const xScale = scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, width])
    .padding(0.4);

  useEffect(() => {
    const SVG = select(rectRef.current);
    DrowFootChart(
      SVG,
      data,
      height,
      width,
      margin,
      selectedMonth,
      slider,
      HandleGraph,
    );

    const xAxis = axisBottom(xScale).tickFormat((month) => month.slice(0, 3));

    if (xAxisRef.current) {
      d3.select(xAxisRef.current).call(xAxis);
    }
  }, [data, selectedMonth, xScale, width, height, slider, HandleGraph]);

  return (
    <svg ref={rectRef} viewBox={`0 0 ${width} ${height}`}>
    </svg>
  );
};

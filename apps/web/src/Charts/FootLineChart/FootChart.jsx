import React, { useEffect, useRef } from "react";
import { select } from "d3";
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
  const rectRef = useRef();

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
  }, [data, selectedMonth, width, height, slider, HandleGraph]);

  return (
    <svg ref={rectRef} viewBox={`0 0 ${width} ${height}`}>
    </svg>
  );
};

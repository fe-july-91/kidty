import React, { useEffect, useRef } from 'react';
import { select } from 'd3';
import { DrowLineChart } from './DrowLineChart';
import { Data } from '../../Shared/types/types';

interface GraphProps {
  width: number;
  height: number;
  data: Data[];
  selectedMonth: string;
  slider?: number;
  HandleGraph: (d: Data) => void;
}

export const WeightLineChart: React.FC<GraphProps> = ({
  width,
  height,
  data,
  selectedMonth,
  slider,
  HandleGraph,
}) => {
  const margin = 20;
  const targetMonth = selectedMonth;

  const rectRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const SVG = select(rectRef.current);
    DrowLineChart(
      SVG,
      data,
      height,
      width,
      margin,
      targetMonth,
      slider,
      HandleGraph
    );
  }, [data, targetMonth, width, height, slider, HandleGraph]);

  return <svg ref={rectRef} viewBox={`0 0 ${width} ${height}`}></svg>;
};

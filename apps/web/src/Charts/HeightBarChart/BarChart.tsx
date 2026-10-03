import React, { useEffect, useRef } from 'react';
import { select } from 'd3';
import { DrawChart } from './DrowChart';
import { Data } from '../../Shared/types/types';

interface GraphProps {
  width: number;
  height: number;
  data: Data[];
  selectedMonth: string;
  slider?: number;
  HandleGraph: (d: Data) => void;
}

export const BarChart: React.FC<GraphProps> = React.memo(
  ({ width, height, data, selectedMonth, slider, HandleGraph }) => {
    const margin = 20;
    const rectRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      const SVG = select(rectRef.current);
      DrawChart(
        SVG,
        data,
        height,
        width,
        margin,
        selectedMonth,
        slider,
        HandleGraph
      );
    }, [data, selectedMonth, width, height, slider, HandleGraph]);

    return <svg ref={rectRef} viewBox={`0 0 ${width} ${height}`}></svg>;
  }
);

import { useEffect, useRef } from "react";
import { select } from 'd3';
import { DrawEyesChart } from "./DrawEyesChart";

export const EyesChart = ({
  data,
  width,
  height,
  sliderLeft,
  sliderRight
}) => {
  const margin = 20;
  const gap = 10; // Расстояние между диаграммами
  const svgRef = useRef();

  useEffect(() => {
    const SVG = select(svgRef.current)

    const singleWidth = (width - gap) / 2;


  // Первая диаграмма для `sliderLeft`
  DrawEyesChart(
    SVG,
    singleWidth,
    "#50C3F9",
    height,
    margin,
    sliderLeft,
  );

  // Вторая диаграмма для `sliderRight`
  DrawEyesChart(
    SVG,
    singleWidth,
    "#C88CF8",
    height,
    margin,
    sliderRight,
    singleWidth + gap // Смещение по горизонтали для второй диаграммы
  );
  }, [data, height, width,sliderLeft, sliderRight])
  
  return <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
         >
         </ svg>

}
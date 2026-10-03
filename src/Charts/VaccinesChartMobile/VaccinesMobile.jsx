import { useEffect, useRef } from "react";
import { select } from "d3";
import { DrawVaccinesMobile } from "./DrawVaccinesMobile";

export const VaccinesMobile = ({
  width,
  height,
  data,
  activeVaccine,
  selectedVaccine,
  newVaccine,
  birth,
  HandleGraph,
  activeBatton,
  handleVaccineclick
}) => {

  const margin = 22;
  const targeVaccine = activeVaccine;
  const updatedVaccine = newVaccine;
  const rectRef = useRef();

  useEffect(() => {
    const SVG = select(rectRef.current);
    DrawVaccinesMobile(
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
    );

  }, [
      data, 
      handleVaccineclick, 
      targeVaccine, 
      width, 
      height, 
      birth, 
      HandleGraph, 
      updatedVaccine,
      activeBatton,
      selectedVaccine
  ]);

  return (
    <svg ref={rectRef} viewBox={`0 0 ${width} ${height}`}>
    </svg>
  );
};

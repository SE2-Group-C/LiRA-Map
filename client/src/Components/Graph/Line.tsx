import { FC, useEffect } from 'react';
import GLine from '../../assets/graph/line';
import { useGraph } from '../../context/GraphContext';
import { Path } from '../../models/path';

import {
  Axis,
  DotHover,
  GraphAxis,
  GraphData,
  SVG,
} from '../../assets/graph/types';
import { Bounds } from '../../models/path';

interface ILine {
  svg: SVG;
  xAxis: Axis | undefined;
  yAxis: Axis | undefined;
  pathData: Path;
  data: GraphData;
  bounds?: Bounds;
  label: string;
  i: number;
  time: boolean | undefined;
  selectedTaskID: number;
  selectedMeasurementName: string;
}

const Line: FC<ILine> = ({
  svg,
  xAxis,
  yAxis,
  pathData,
  data,
  bounds,
  label,
  i,
  time,
  selectedTaskID,
  selectedMeasurementName,
}) => {
  const { addBounds, remBounds, setDotHover, useMarkers } = useGraph();

  useEffect(() => {
    if (xAxis === undefined || yAxis === undefined) return;

    const _bounds: Required<Bounds> = Object.assign({
      minX: Math.min(...data.map((d) => d[0])),
      maxX: Math.max(...data.map((d) => d[0])),
      minY: bounds?.minY,
      maxY: bounds?.maxY,
    });

    addBounds(label, _bounds);

    const onHover = (d: DotHover | undefined) =>
      d === undefined
        ? setDotHover(undefined)
        : setDotHover({ ...d, x: d.x / _bounds.maxX });

    const line = new GLine(
      svg,
      label,
      i,
      pathData,
      data,
      xAxis,
      yAxis,
      onHover,
      time,
      useMarkers,
      selectedTaskID,
      selectedMeasurementName,
    );

    return () => {
      if (svg === undefined)
        return console.log(
          'ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined',
        );

      line.rem();
      remBounds(label);
    };
  }, [svg, xAxis, yAxis, data, label, bounds, i, setDotHover]);

  useEffect(() => {
    console.log('test');
  }, [data]);

  return null;
};

export default Line;

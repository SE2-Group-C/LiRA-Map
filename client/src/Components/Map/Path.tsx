import React, { FC } from 'react';
import { useGraph } from '../../context/GraphContext';

import { PathProps, PointData } from '../../models/path';
import { RendererOptions } from '../../models/properties';
import { Renderer } from '../../models/renderers';

import { RENDERER_OPTIONS } from './constants';
import renderers from './renderers';
import { useGeneralGraphContext } from '../../context/GeneralGraphContext';

const Path: FC<PathProps> = ({ path, properties, onClick }) => {
  const { minY, maxY } = useGeneralGraphContext();

  const FCRenderer = renderers(properties.rendererName) as Renderer<PointData>;

  const options: Required<RendererOptions> = {
    ...RENDERER_OPTIONS,
    ...properties,
    min: minY,
    max: maxY,
  };

  return (
    <>
      {path.length !== 0 && FCRenderer !== undefined ? (
        <FCRenderer
          data={path}
          getLat={(t: PointData) => t.lat}
          getLng={(t: PointData) => t.lng}
          getVal={(t: PointData) =>
            t.value !== undefined ? Math.max(0.01, t.value) : 0.01
          }
          options={options}
          eventHandlers={{ click: onClick }}
        />
      ) : null}
    </>
  );
};

export default Path;

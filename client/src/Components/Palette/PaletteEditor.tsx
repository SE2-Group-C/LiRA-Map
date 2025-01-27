import React, { FC, MouseEvent, useState } from 'react';
import { Gradient } from 'react-gradient-hook';
import { CursorOptions } from 'react-gradient-hook/lib/types';
import { useMap } from 'react-leaflet';
import { Palette } from 'react-leaflet-hotline';

import '../../css/palette.css';

interface IPaletteEditor {
  width: number | undefined;
  defaultPalette?: Palette;
  cursorOptions?: CursorOptions;
  onChange?: (palette: Palette) => void;
}

const PaletteEditor: FC<IPaletteEditor> = ({
  width,
  defaultPalette,
  cursorOptions,
  onChange,
}) => {
  const [show, setShow] = useState<boolean>(false);

  const toggleAppear = () => setShow((prev) => !prev);

  if (width === undefined || width === 0) return null;

  return (
    <div
      className={`palette-wrapper ${show ? 'palette-show' : ''}`}
      style={{ width: `100vw` }}
    >
      <div
        className="palette-container"
        style={{ visibility: show ? 'visible' : 'hidden' }}
      >
        <Gradient
          defaultColors={defaultPalette}
          cursorOptions={cursorOptions}
          onChange={onChange}
        />
      </div>
      <div className="palette-hover" onClick={toggleAppear}>
        🎨
      </div>
    </div>
  );
};

export default PaletteEditor;

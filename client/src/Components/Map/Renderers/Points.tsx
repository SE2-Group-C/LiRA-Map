
import { FC } from "react";

import { PointData, RendererProps, PointProps } from "../../../assets/models";

interface Props extends RendererProps {
    PointElt: FC<PointProps>
}

/*
    Used to render Rectangles and Circles
*/
const Points: FC<Props> = ( { path, properties, setMarker, PointElt } ) => {
    return (
        <>
        {
            path.data.map( (point: PointData, i: number) => {
                return <PointElt 
                    key={`PointElt${Math.random()}`}
                    pos={point.pos} 
                    properties={properties} 
                    setMarker={setMarker} />
            } )
        }
        </>
    )
}

export default Points;
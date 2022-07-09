import { FC, useEffect, useRef, useState } from "react";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { GraphProvider } from "../../context/GraphContext";
import { useMetasCtx } from "../../context/MetasContext";
import { ZoomProvider } from "../../context/ZoomContext";

import { ActiveMeasProperties } from "../../models/properties";
import { MeasMetaPath, PointData } from "../../models/path";

import { GraphData } from "../../assets/graph/types";

import { getRide } from "../../queries/rides";

import Graph from "../Graph/Graph";
import RidesMap from "./RidesMap";
import usePopup from "../createPopup";

const Rides: FC = () => {
    
    const { selectedMetas } = useMetasCtx()
    const { selectedMeasurements } = useMeasurementsCtx()

    const [ paths, setPaths ] = useState<MeasMetaPath>({})

    const popup = usePopup()

    useEffect( () => {

        const updatePaths = async () => {
            const temp = {} as MeasMetaPath;

            for ( let meas of selectedMeasurements )
            {
                const { name } = meas
                temp[name] = {}

                for ( let meta of selectedMetas )
                {
                    const { TaskId } = meta;
    
                    if ( Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId) )
                        temp[name][TaskId] = paths[name][TaskId]
                    else {
                        const bp = await getRide(meas, meta, popup)
                        if ( bp !== undefined )
                            temp[name][TaskId] = bp;
                    }
                } 
            }

            return temp;
        }
        
        updatePaths().then( setPaths )

    }, [selectedMetas, selectedMeasurements] )

    return (
        <ZoomProvider>
        <GraphProvider>
            <div className="map-container">

                <RidesMap
                    paths={paths} 
                    selectedMetas={selectedMetas} 
                    selectedMeasurements={selectedMeasurements}  />

                { selectedMeasurements.map( (measurement: ActiveMeasProperties, i: number) => measurement.hasValue && 
                    <Graph 
                        key={`graph-${i}`}
                        labelX="Time (absolute)" 
                        labelY={measurement.name}
                        absolute={true}
                        time={true}
                        palette={measurement.palette}
                        plots={ Object.entries(paths[measurement.name] || {})
                            .map( ([TaskId, bp], j) => {
                                const { path, bounds } = bp;

                                const data: GraphData = path.map( (p: PointData, k: number) => 
                                    [p.metadata.timestamp, p.value || 0, k]
                                )
                                return { data, bounds, label: 'r-' + TaskId, j }
                            } ) 
                        }
                    />
                ) }
            </div>
        </GraphProvider>
        </ZoomProvider>
  )
}

export default Rides;
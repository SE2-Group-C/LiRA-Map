
import { FC, useState, useEffect } from "react";

import EventPath from "./EventPath";
import usePopup from '../Popup'

import { ChartData, DataPath, Measurement, RideMeasurement } from '../../assets/models'
import { post } from '../../assets/fetch'

import '../../css/road.css'



interface Props {
    measurements: RideMeasurement[], 
    tripId: string, 
    taskId: number, 
    addChartData: (dataName: string, data: ChartData) => void,
    removeChartData: (dataName: string) => void
}

interface LoadablePath {
    loaded: boolean;
    displayed: boolean;
    dataPath: DataPath | undefined
}

const getEmptyLoadablePath = () => {
    return { loaded: false, displayed: false, dataPath: undefined }
}
 
const Ride: FC<Props> = ( { measurements, tripId, taskId, addChartData, removeChartData } ) => {

    console.log(measurements);
    
    
    const [paths, setPaths] = useState<LoadablePath[]>(
        measurements.map(getEmptyLoadablePath)
    )  
    const popup = usePopup()

    const getDataName = (measurement: Measurement): string => {
        return taskId.toString()
    }

    const requestMeasurement = ( measIndex: number ) => {     
        if ( paths[measIndex] !== undefined && paths[measIndex].loaded ) 
            return;

        const meas: Measurement = measurements[measIndex]
        const { query, queryMeasurement, hasValue, name }: Measurement = meas
        
        post( query, { tripID: tripId, measurement: queryMeasurement }, (data: DataPath) => {            
            
            const { path, minValue, maxValue, minTime, maxTime } = data;

            console.log(data);
            
            // update paths
            const temp = [...paths]
            temp[measIndex].dataPath = data;
            temp[measIndex].loaded = true;
            temp[measIndex].displayed = true;
            setPaths(temp)
            
            // pushRequestForOne( path, measIndex )

            console.log("Got data for ride: ", tripId, ", length: ", path.length); 
            console.log("Min value", minValue, "Max Value", maxValue);
            console.log("Min time", minTime, "Max Time", maxTime);

            if ( hasValue )
            {
                if ( path.length === 0 )
                    return popup( {
                        icon: "warning",
                        title: `This trip doesn't contain data for ${name}`,
                        footer: `TripId: ${tripId} | TaskId: ${taskId}`
                    } );

                const chartData = path.map( (d: any) => { 
                    return { x: d.timestamp as number - (minTime || 0), y: d.value as number } 
                } )            
                addChartData( getDataName(meas), chartData )
            }
        })
    }

    
    useEffect( () => { 
        // when adding a new measurement                
        if ( measurements.length > paths.length )
            requestMeasurement(paths.length)

        paths.forEach( (p: any, i: number) => {
            const meas = measurements[i]

            console.log(i, meas.isActive, p.loaded, p.displayed);
            

            // load and show
            if ( meas.isActive && !p.loaded )
                requestMeasurement(i)

            // show without loading it again since it's already loaded
            else if ( meas.isActive && p.loaded && !p.displayed )
            {
                const temp: any = [...paths]
                temp[i].displayed = true;
                setPaths(temp)

                addChartData( getDataName(meas), temp[i] )
            }
            // hide but keep in memory 
            else if ( !meas.isActive && p.loaded && p.displayed )
            {
                console.log('UNLOADING', i);
                
                const temp: any = [...paths]
                temp[i].displayed = false;
                setPaths(temp)

                removeChartData( getDataName(meas) )
            }
        })        
    }, [measurements] );


    return (
        <>
        { paths.map( (p: LoadablePath, i: number) => 
            measurements[i].isActive && p.loaded && p.displayed && p.dataPath !== undefined 
                ? <EventPath 
                    key={`path${Math.random()}`} 
                    dataPath={p.dataPath} 
                    properties={measurements[i]}/>
                : null
                     
        ) }
        </>
    )
}

export default Ride;
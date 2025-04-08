import { MeasurePoint } from "../../types/MeasurePoint";

export const pointsStub: any[] = [
  {
    id: '1',
    name: 'Point 1',
    type: 'Point',
    belongsToMonitoringLocation: '1',
    typeMonitoringsPoint: 'water_level',
    waterExtractionType: 'extraction',
    status: 'completed',
    depthRange: '1'
  },
  {
    id: '2',
    name: 'Point 2',
    type: 'Point',
    belongsToMonitoringLocation: '1',
    typeMonitoringsPoint: 'water_level',
    waterExtractionType: 'extraction',
    status: 'completed',
    depthRange: '2'
  },
  {
    id: '3',
    name: 'Point 3',
    type: 'Point',
    belongsToMonitoringLocation: '2',
    typeMonitoringsPoint: 'water_level',
    waterExtractionType: 'extraction',
    status: 'completed',
    depthRange: '3'
  }
];

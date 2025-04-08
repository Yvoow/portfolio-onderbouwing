import { Enum } from '../../types/Enum';

export const enumerationsStub: Enum[] = [
  {
    id: 'active',
    label: 'Active',
    type: 'ProjectStatus'
  },
  {
    id: 'inactive',
    label: 'Inactive',
    type: 'ProjectStatus'
  },
  {
    id: 'read',
    permissions: ['read'],
    defaultrole: true,
    type: 'Role'
  },
  {
    id: 'water_level',
    type: 'MeasurePointType',
    label: 'Water level'
  },
  {
    id: 'extraction',
    type: 'WaterExtractionType',
    label: 'Extraction'
  },
  {
    id: 'completed',
    type: 'PointStatus',
    label: 'Completed'
  },
  {
    id: 'default',
    type: 'ProjectType',
    label: 'Default'
  }
];

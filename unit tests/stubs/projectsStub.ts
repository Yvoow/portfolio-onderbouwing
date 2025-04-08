import { Project } from '../../types/Project';

export const projectStubs: any[] = [
  {
    id: 'project1',
    name: 'Project 1',
    belongsToCompany: 'company1',
    status: 'status1',
    code: 'P001',
    createdAt: new Date().toISOString(),
    coordinates: {},
    startdate: '',
    type: 'default'
  },
  {
    id: 'project2',
    name: 'Project 2',
    belongsToCompany: 'company2',
    status: {
      id: 'status1',
      label: 'Active',
    },
    code: 'P002',
    createdAt: new Date().toISOString(),
    coordinates: {},
    startdate: '',
    type: ''
  },
  {
    id: 'project3',
    name: 'Project without status and incorrect company partition key',
    belongsToCompany: 'non-existing company',
    code: 'P003',
    createdAt: new Date().toISOString(),
    coordinates: {},
    startdate: '',
    type: ''
  },

];

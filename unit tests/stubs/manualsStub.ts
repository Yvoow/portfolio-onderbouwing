export const manualsStub = [
  {
    id: 'manual1',
    title: 'Manual 1',
    content: 'Content 1',
    topLevel: true,
    version: 1
  },
  {
    id: 'manual2',
    title: 'Manual 2',
    content: 'Content 2',
    version: 1,
  },
  {
    id: 'manual3',
    title: 'Manual 3',
    content: 'Content 3',
    concept: true,
    version: 1
  },
  {
    id: 'manual4',
    title: 'Manual 4',
    content: 'Content 4',
    belongsToManual: 'manual1',
    version: 1
  },
  {
    id: 'manual5',
    title: 'Manual 5',
    content: 'Content 5',
    old: true,
    version: 1
  },
  {
    id: 'manual6',
    title: 'Manual 6',
    content: 'Content 6',
    originalManual: 'manual5',
    topLevel: true,
    version: 2
  },
  {
    id: 'manual7',
    title: 'Manual 7',
    content: 'Content 7',
    belongsToManual: 'manual5',
    version: 3
  }
];

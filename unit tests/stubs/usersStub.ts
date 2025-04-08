import { User } from '../../types/User';

export const usersStub: User[] = [
  {
    id: "5294875-ghg-3452",
    username: "berry.vandervelden@geonius.nl",
    name: "Berry van der Velden",
    belongsToCompany: "company1",
    userProjects: [ { id: "project1", role: "role1" } ],
    inviteAccepted: true,
  },
  {
    id: "5294875-ghg-3453",
    username: "y.heijltjes@geonius.nl",
    name: "Yvo Heijltjes",
    belongsToCompany: "company1",
    userProjects: [ { id: "project1", role: "role1" } ],
    inviteAccepted: false,
    settings: {
      language: "nl",
    }
  }
];

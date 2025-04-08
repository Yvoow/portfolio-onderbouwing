import { SqlQuerySpec } from "@azure/cosmos";
import { DatabaseClient } from "../../services/LocationsDatabaseClient";
import { locationsStub } from "../stubs/locationsStub";
import { usersStub } from "../stubs/usersStub";
import { User } from "../../types/User";
import { Enum } from "../../types/Enum";
import { enumerationsStub } from "../stubs/enumerationsStub";

export class MockDatabaseClient implements DatabaseClient {
  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub.filter((enumeration) => enumeration.type === type);
  }

  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    return usersStub;
  }

  async queryLocations(sectionId, user): Promise<any[]> {
    let result = locationsStub;

    if (!user.isApplicationAdmin && !user.isCompanyAdmin) {
      const project = user.userProjects?.find((project: any) => project.sections?.some((section: any) => section.id === sectionId));
      if (project) {
        const section = project.sections?.find((section: any) => section.id === sectionId);
        if (section) {
          const noaccess = section.locations?.filter((location: any) => !location.permissions?.includes('read'));
          if (noaccess.length > 0) {
            result = result.filter((location) => !noaccess.some((noaccessLocation) => noaccessLocation.id === location.id));
          }
        }
      }
    }
    return result;
  }

  async queryLocationById(id: string): Promise<any> {
    return locationsStub.find((location) => location.id === id);
  }

  async getLocations(query: SqlQuerySpec, pageSize?, pageNumber?): Promise<any> {
    let result = locationsStub;

    if (query.parameters) {
      const sectionIds = [];
      query.parameters.forEach((param) => {
        if (param.name === '@name') {
          result = result.filter((location) => location.name === param.value);
        }
        if (param.name.startsWith('@belongsToSection')) {
          sectionIds.push(param.value);
        }
      });

      if (sectionIds.length > 0) {
        result = result.filter((location) => sectionIds.includes(location.belongsToSection));
      }
    }

    const count = result.length;
    if (pageSize > 0 && pageNumber > 0) {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      result = result.slice(start, end);
    }

    return { data: result, count: count };
  }

  async queryLocationsBySectionIds(sectionIds: string[]): Promise<any[]> {
    return locationsStub.filter((location) => sectionIds.includes(location.belongsToSection));
  }
}

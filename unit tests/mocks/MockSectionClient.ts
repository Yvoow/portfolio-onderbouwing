import { SqlQuerySpec } from "@azure/cosmos";
import { DatabaseClient } from "../../services/SectionDatabaseClient";
import { sectionStubs } from "../stubs/sectionsStub";
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

  async querySections(query: SqlQuerySpec): Promise<any[]> {
    let result = sectionStubs;

    if (query.parameters) {
      const sectionIds = [];
      query.parameters.forEach((param) => {
        if (param.name === '@id') {
          result = result.filter((section) => section.id === param.value);
        }
        if (param.name === '@name') {
          result = result.filter((section) => section.name === param.value);
        }
        if (param.name.startsWith('@belongsToProject') || param.name.startsWith('@projectId')) {
          sectionIds.push(param.value);
        }
      });

      if (sectionIds.length > 0) {
        result = result.filter((section) => sectionIds.includes(section.belongsToProject));
      }
    }

    return result;
  }

  async querySectionById(id: string): Promise<any> {
    return sectionStubs.find((section) => section.id === id);
  }

  async querySectionsByProjectIds(projectIds: string[]): Promise<any[]> {
    return sectionStubs.filter((section) => projectIds.includes(section.belongsToProject));
  }

  async getSections(query: SqlQuerySpec, pageSize?, pageNumber?): Promise<any> {
    let result = sectionStubs;

    if (query.parameters) {
      const sectionIds = [];
      query.parameters.forEach((param) => {
        if (param.name === '@name') {
          result = result.filter((section) => section.name === param.value);
        }
        if (param.name === '@code') {
          result = result.filter((section) => section.code === param.value);
        }
        if (param.name.startsWith('@belongsToProject') || param.name.startsWith('@projectId')) {
          sectionIds.push(param.value);
        }
        if (param.name === '@noAccessIds') {
          const noAccessIds = typeof param.value === 'string' ? param.value.split(',') : [];
          result = result.filter((section) => !noAccessIds.includes(section.id));
        }
      });

      if (sectionIds.length > 0) {
        result = result.filter((section) => sectionIds.includes(section.belongsToProject));
      }
    }

    const count = result.length;
    if (pageSize > 0 && pageNumber > 0) {
      result = result.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    }

    return { data: result, count: count };
  }
}

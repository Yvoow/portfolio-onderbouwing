import { SqlQuerySpec } from "@azure/cosmos";
import { DatabaseClient } from "../../services/UserDatabaseClient";
import { usersStub } from "../stubs/usersStub";
import { companiesStub } from "../stubs/companiesStub";
import { User } from "../../types/User";
import { Enum } from "../../types/Enum";
import { enumerationsStub } from "../stubs/enumerationsStub";

export class MockDatabaseClient implements DatabaseClient {
  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub.filter((enumeration) => enumeration.type === type);
  }

  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    let result = usersStub;

    if (query.parameters) {
      query.parameters.forEach((param) => {
        if (param.name === '@id')
        {
          result = result.filter((user) => user.id === param.value);
        }
        if (param.name === '@mail') {
          result = result.filter((user) => user.username === param.value);
        }
        if (param.name === '@name') {
          result = result.filter((user) => user.name === param.value);
        }
        if (param.name === '@projectId') {
          result = result.filter((user) => user.userProjects.some((project) => project.id === param.value));
        }
        if (param.name === '@username') {
          result = result.filter((user) => user.username === param.value);
        }
        if (param.name === '@company') {
          result = result.filter((user) => user.belongsToCompany === param.value);
        }
      });
    }

    return result;
  }

  async getUsers(query: SqlQuerySpec, pageSize?: number | null, page?: number | null): Promise<any> {
    let result = usersStub;
    if (query.parameters) {
      query.parameters.forEach((param) => {
        if (param.name === '@id')
        {
          result = result.filter((user) => user.id === param.value);
        }
        if (param.name === '@mail') {
          result = result.filter((user) => user.username === param.value);
        }
        if (param.name === '@name') {
          result = result.filter((user) => user.name === param.value);
        }
        if (param.name === '@projectId') {
          result = result.filter((user) => user.userProjects.some((project) => project.id === param.value));
        }
        if (param.name === '@username') {
          result = result.filter((user) => user.username === param.value);
        }
        if (param.name === '@company') {
          result = result.filter((user) => user.belongsToCompany === param.value);
        }
      });
    }

    const count = result.length;
    if (pageSize > 0 && page > 0) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      result = result.slice(start, end);
    }

    return {data: result, count: count};
  }

  async getCompanyById(id: string): Promise<any> {
    return companiesStub.find((company) => company.id === id);
  }

  async getAllCompanies(): Promise<any> {
    return companiesStub;
  }

  async activateUser(user): Promise<any> {
    if (!user.inviteAccepted) {
      return true
    }
  }

  async addMicrosoftId(user, userid): Promise<any> {
    if (!user.microsoftId) {
      return true
    }
  }

  async patchUser(user, operations): Promise<any> {
    let userToPatch = usersStub.find((u) => u.id === user.id);
    operations.forEach((operation) => {
      if (operation.path === '/settings/language') {
        userToPatch.settings.language = operation.value;
      }
    });

    return userToPatch;
  }
}

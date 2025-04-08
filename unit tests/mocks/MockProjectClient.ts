// mocks/MockDatabaseClient.ts
import { SqlQuerySpec } from '@azure/cosmos';
import { DatabaseClient } from '../../services/ProjectDatabaseClient';
import { Company } from '../../types/Company';
import { Project } from '../../types/Project';
import { Section } from '../../types/Section';
import { Enum } from '../../types/Enum';
import { companiesStub } from '../stubs/companiesStub';
import { projectStubs } from '../stubs/projectsStub';
import { sectionStubs } from '../stubs/sectionsStub';
import { enumerationsStub } from '../stubs/enumerationsStub';
import { usersStub } from '../stubs/usersStub';
import { manualsStub } from '../stubs/manualsStub';
import { User } from '../../types/User';

export class MockDatabaseClient implements DatabaseClient {
  async countProjects(query: SqlQuerySpec): Promise<number> {
    return projectStubs.length;
  }

  async queryCompany(id: string): Promise<Company[]> {
    return companiesStub.filter((company) => company.id === id);
  }

  async getCompaniesByIds(companyIds: string[]): Promise<Company[]> {
    return companiesStub.filter((company) => companyIds.includes(company.id));
  }

  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub;
  }

  async querySections(projectIds: string[]): Promise<Section[]> {
    return sectionStubs;
  }

  async queryProjects(query: SqlQuerySpec): Promise<Project[]> {
    let projects = projectStubs;

    // Filtering
    for (const param of query.parameters) {
      switch (param.name) {
        case '@projectIds':
          projects = projects.filter((project) => (param.value as string[]).includes(project.id));
          break;
        case '@company':
          projects = projects.filter((project) => project.belongsToCompany === param.value as string);
          break;
        case '@name':
          projects = projects.filter((project) => project.name.includes(param.value as string));
          break;
        case '@code':
          projects = projects.filter((project) => project.code.includes(param.value as string));
          break;
        case '@type':
          projects = projects.filter((project) => project.type === param.value as string);
          break;
        case '@statuses':
          projects = projects.filter((project) => (param.value as string[]).includes(project.status.id));
          break;
        case '@none':
          projects = projects.filter((project) => false);
      }
    }

    // Pagination
    const offsetParam = query.parameters.find((param) => param.name === '@offset');
    const limitParam = query.parameters.find((param) => param.name === '@limit');
    const offset = offsetParam ? Number(offsetParam.value) : undefined;
    const limit = limitParam ? Number(limitParam.value) : undefined;
    if (offset !== undefined && limit !== undefined) {
      projects = projects.slice(offset, offset + limit);
    }

    // Sorting
    const orderBy = query.query.match(/ORDER BY c\.(\w+)/);
    const order = query.query.match(/ORDER BY c\.\w+ (ASC|DESC)/);
    if (orderBy) {
      const key = orderBy[1];
      projects = projects.sort((a, b) => {
        if (a[key] < b[key]) return order && order[1] === 'DESC' ? 1 : -1;
        if (a[key] > b[key]) return order && order[1] === 'DESC' ? -1 : 1;
        return 0;
      });
    }

    return projects;
  }

  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    return usersStub;
  }

  async getProjectById(id: string, companyId?: string | null): Promise<any> {
    let result = projectStubs
    if (companyId) {
      result = result.filter((project) => project.belongsToCompany === companyId);
    }
    return result.find((project) => project.id === id);
  }
}

// mocks/MockDatabaseClient.ts
import { SqlQuerySpec } from '@azure/cosmos';
import { DatabaseClient } from '../../services/ManualDatabaseClient';
import { manualsStub } from '../stubs/manualsStub';
import { usersStub } from '../stubs/usersStub';
import { User } from '../../types/User';
import { Enum } from '../../types/Enum';
import { enumerationsStub } from '../stubs/enumerationsStub';

export class MockDatabaseClient implements DatabaseClient {
  async queryManuals(query: SqlQuerySpec): Promise<any> {
    let manuals = manualsStub;

    // Filtering
    for (const param of query.parameters) {
      switch (param.name) {
        case '@concept':
          manuals = manuals.filter((manual) => !manual.concept || manual.concept === param.value);
          break;
        case '@published':
          manuals = manuals.filter((manual) => !manual.concept || manual.concept === param.value);
          break;
        case '@old':
          manuals = manuals.filter((manual) => !manual.old || manual.old === param.value);
          break;
      }
    }

    return manuals;
  }

  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub;
  }

  async queryManual(query: SqlQuerySpec): Promise<any> {
    let manuals = manualsStub;
    // Filtering
    for (const param of query.parameters) {
      switch (param.name) {
        case '@id':
          manuals = manuals.filter((manual) => manual.id === param.value);
          break;
        case '@concept':
          manuals = manuals.filter((manual) => !manual.concept || manual.concept === param.value);
      }
    }
    return manuals;
  }



  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    return usersStub;
  }

  async createManual(newManual: any): Promise<any> {
    let manual = { ...newManual, id: 'newManualId' };
    manualsStub.push(manual);
    return manual;
  }

  async updateManual(updatedManual: any): Promise<any> {
    let manualindex = manualsStub.findIndex((manual) => manual.id === updatedManual.id);
    manualsStub[manualindex] = updatedManual;
    return updatedManual;
  }
}

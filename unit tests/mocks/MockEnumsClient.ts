import { SqlQuerySpec } from '@azure/cosmos';
import { DatabaseClient } from '../../services/EnumsDatabaseClient';
import { manualsStub } from '../stubs/manualsStub';
import { usersStub } from '../stubs/usersStub';
import { User } from '../../types/User';
import { Enum } from '../../types/Enum';
import { enumerationsStub } from '../stubs/enumerationsStub';

export class MockDatabaseClient implements DatabaseClient {
  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub.filter((enumeration) => enumeration.type === type);
  }

  async createEnumeration(newEnumeration: any): Promise<any> {
    enumerationsStub.push(newEnumeration);
    return newEnumeration;
  }

  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    return usersStub;
  }

  async fetchEnums(): Promise<Enum[]> {
    return enumerationsStub;
  }

  async patchRole(id: string, operations: any): Promise<Enum> {
    const roleIndex = enumerationsStub.findIndex((role) => role.id === id);
    const role = enumerationsStub[roleIndex];

    for (const operation of operations) {
      if (operation.path === '/permissions') {
        role.permissions = operation.value;
      }
      if (operation.path === '/defaultrole') {
        role.defaultrole = operation.value;
      }
    }
    return role;
  }
}

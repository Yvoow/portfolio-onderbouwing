import { SqlQuerySpec } from "@azure/cosmos";
import { DatabaseClient } from '../../services/AuthDatabaseClient';
import { Enum } from '../../types/Enum';
import { usersStub } from '../stubs/usersStub';
import { User } from '../../types/User';
import { enumerationsStub } from '../stubs/enumerationsStub';

export class MockDatabaseClient implements DatabaseClient {
  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    return usersStub;
  }

  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub.filter((enumeration) => enumeration.type === type);
  }
}

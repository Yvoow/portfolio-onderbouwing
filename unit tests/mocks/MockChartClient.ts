import { SqlQuerySpec } from '@azure/cosmos';
import { DatabaseClient } from '../../services/ChartDatabaseClient';
import { chartStub } from '../stubs/chartStub';
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

  async query24HValues(measurePoint: string, condition: string | null, quantity: string | null, start: number, end: number): Promise<any> {
    let result = chartStub;
    if (measurePoint) {
      result = result.filter((item: any) => item.belongsToMonitoringPoint === measurePoint);
    }
    if (condition) {
      result = result.filter((item: any) => item.condition === condition);
    }
    if (quantity) {
      result = result.filter((item: any) => item.quantity === quantity);
    }
    if (start) {
      result = result.filter((item: any) => item.datetime >= start);
    }
    if (end) {
      result = result.filter((item: any) => item.datetime <= end);
    }

    return result;
  }

  async queryValues(measurePoint: string, condition: string | null, quantity: string | null, start: number, end: number, manual?: boolean): Promise<any> {
    let result = chartStub;
    if (measurePoint) {
      result = result.filter((item: any) => item.belongsToMonitoringPoint === measurePoint);
    }
    if (condition) {
      result = result.filter((item: any) => item.condition === condition);
    }
    if (quantity) {
      result = result.filter((item: any) => item.quantity === quantity);
    }
    if (start) {
      result = result.filter((item: any) => item.datetime >= start);
    }
    if (end) {
      result = result.filter((item: any) => item.datetime <= end);
    }
    if (manual) {
      result = result.filter((item: any) => item.manualMeasurement === manual);
    }

    return result;
  }
}

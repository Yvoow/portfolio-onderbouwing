// mocks/MockDatabaseClient.ts
import { SqlQuerySpec } from '@azure/cosmos';
import { DatabaseClient } from '../../services/MeasureValuesDatabaseClient';
import { usersStub } from '../stubs/usersStub';
import { User } from '../../types/User';
import { Enum } from '../../types/Enum';
import { enumerationsStub } from '../stubs/enumerationsStub';
import { measureValuesStub } from '../stubs/measurevaluesStub';
import { MeasureValue } from '../../types/MeasureValue';

export class MockDatabaseClient implements DatabaseClient {

  async queryEnumerations(type: string): Promise<Enum[]> {
    return enumerationsStub;
  }

  async queryUsers(query: SqlQuerySpec): Promise<User[]> {
    return usersStub;
  }

  async createMeasureValue(newMeasureValue: MeasureValue): Promise<any> {
    let measureValue = { ...newMeasureValue, id: 'nieuweID' };
    measureValuesStub.push(measureValue);
    return measureValue;
  }

  async deleteMeasureValue(mv: MeasureValue): Promise<any> {
    try {
      const index = measureValuesStub.findIndex(m => m.id === mv.id);
      measureValuesStub.splice(index, 1);
      return 200;
    } catch (error) {
      return 500;
    }
  }

  async queryMeasureValues(query: SqlQuerySpec): Promise<MeasureValue[]> {
    let result = measureValuesStub;

    if (query.parameters) {
      for (let p of query.parameters) {
        if (p.name === '@belongsToMonitoringPoint') {
          result = result.filter(m => m.belongsToMonitoringPoint === p.value);
        }
        if (p.name === '@id') {
          result = result.filter(m => m.id === p.value);
        }
        if (p.name === '@quantity') {
          result = result.filter(m => m.quantity === p.value);
        }
        if (p.name === '@condition') {
          result = result.filter(m => m.condition === p.value);
        }
      }
    }

    return result;
  }
}



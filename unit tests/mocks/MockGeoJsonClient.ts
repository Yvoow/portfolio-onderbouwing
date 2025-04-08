import { SqlQuerySpec } from "@azure/cosmos";
import { DatabaseClient } from "../../services/GeoJsonDatabaseClient";
import { geojsonStub } from "../stubs/geojsonStub";
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

  async queryGeoJson(query: SqlQuerySpec): Promise<any[]> {
    let result = geojsonStub;

    if (query.parameters) {
      const projectIds = [];
      const sectionIds = [];
      query.parameters.forEach((param) => {
        // if (param.name === '@name') {
        //   result = result.filter((geojson) => geojson.name === param.value);
        // }
        if (param.name.startsWith('@belongsToProject')) {
          projectIds.push(param.value);
        }

        if (param.name.startsWith('@belongsToSection')) {
          sectionIds.push(param.value);
        }
      });

      if (projectIds.length > 0) {
        result = result.filter((geojson) => projectIds.includes(geojson.belongsToProject));
      }

      if (sectionIds.length > 0) {
        result = result.filter((geojson) => sectionIds.includes(geojson.belongsToSection));
      }

    }

    return result;
  }

  async queryGeoJsonById(id: string): Promise<any> {
    return geojsonStub.find((geojson) => geojson.id === id);
  }
}

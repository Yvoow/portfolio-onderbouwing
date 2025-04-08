import { SqlQuerySpec } from "@azure/cosmos";
import { DatabaseClient } from "../../services/PointsDatabaseClient";
import { pointsStub } from "../stubs/pointsStub";
import { attachmentsStub } from "../stubs/attachmentsStub";
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

  async queryPoints(locationIds, user): Promise<any[]> {
    let result = pointsStub;

    if (!user.isApplicationAdmin && !user.isCompanyAdmin) {
      const project = user.userProjects?.find((project: any) =>
      project.sections?.some((section: any) =>
      section.locations?.some((location: any) => locationIds.includes(location.id))
      )
      );
      if (project) {
      const section = project.sections?.find((section: any) => section.locations?.some((location: any) => locationIds.includes(location.id)));
      if (section) {
        const accessibleLocations = section.locations?.filter((location: any) => locationIds.includes(location.id));
        accessibleLocations.forEach((location: any) => {
        const noaccess = location.measurePoints?.filter((point: any) => !point.permissions?.includes('read'));
        if (noaccess.length > 0) {
          result = result.filter((point) => !noaccess.some((noaccessPoint) => noaccessPoint.id === point.id));
        }
        });
      }
      }
    }

    return result;
  }

  async queryPointById(id: string, locationid: string): Promise<any> {
    return pointsStub.find((point) => point.id === id && point.belongsToMonitoringLocation === locationid);
  }

  async queryAttachments(id: string): Promise<any> {
    return attachmentsStub.filter((attachment) => attachment.belongsToID === id);
  }

  async getPoints(query: SqlQuerySpec, pageSize?, continuationToken?): Promise<any> {
    let result = pointsStub;
    let response: any = {};
    if (query.parameters) {
      const locationIds = [];
      query.parameters.forEach((param) => {
        if (param.name === '@depthRange') {
          result = result.filter((point) => point.depthRange === param.value);
        }
        if (param.name === '@name') {
          result = result.filter((point) => point.name === param.value);
        }
        if (param.name.startsWith('@belongsToMonitoringLocation')) {
          locationIds.push(param.value);
        }
      });

      if (locationIds.length > 0) {
        result = result.filter((point) => locationIds.includes(point.belongsToMonitoringLocation));
      }
    }

    response.count = result.length;
    if (pageSize > 0) {
      const start = 0;
      const end = pageSize;
      result = result.slice(start, end);
      response.hasMoreResults = result.length < response.count;
      response.continuationToken = response.hasMoreResults ? 'token' : null;
    }
    response.measurePoints = result;


    return response;
  }
}

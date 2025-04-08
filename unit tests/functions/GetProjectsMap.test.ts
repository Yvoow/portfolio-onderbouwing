import { getProjectsMapHandler } from "../../functions/GetProjectsMap";
import { ProjectService } from "../../services/ProjectService";
import { SectionService } from "../../services/SectionService";
import { GeoJsonService } from "../../services/GeoJsonService";
import { AuthService } from "../../services/AuthenticationService";
import { MockDatabaseClient as ProjectMockDatabaseClient } from "../mocks/MockProjectClient";
import { MockDatabaseClient as SectionMockDatabaseClient } from "../mocks/MockSectionClient";
import { MockDatabaseClient as GeoJsonMockDatabaseClient } from "../mocks/MockGeoJsonClient";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockProjectDatabaseClient = new ProjectMockDatabaseClient();
const mockSectionDatabaseClient = new SectionMockDatabaseClient();
const mockGeoJsonDatabaseClient = new GeoJsonMockDatabaseClient();
const mockProjectService = new ProjectService(mockProjectDatabaseClient);
const mockSectionService = new SectionService(mockSectionDatabaseClient);
const mockGeoJsonService = new GeoJsonService(mockGeoJsonDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockProjectDatabaseClient);
jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
  isApplicationAdmin: false,
  isCompanyAdmin: false,
});

// Mock request and context
let mockRequest = {
  query: new URLSearchParams(),
  params: {},
} as unknown as HttpRequest;
const mockContext = {
  error(...args: any[]): void { console.error }
} as InvocationContext;

// Reset the request queries after each test

afterEach(() => {
  jest.resetAllMocks();
  mockRequest = {
    query: new URLSearchParams(),
    params: {},
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });

  test('Return 401 Unauthorized', async () => {
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('Authorized user', () => {
  test('Return only projects that the user has access to', async () => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [{ id: 'project1', role: 'admin' }, { id: 'project2', role: 'admin' }],
    });
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(2);
  });

  test('Return no projects if the user has no access to any project', async () => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [],
    });
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(0);
  });
});

describe('Company admin', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: true,
      belongsToCompany: 'company1',
    });
  });

  test('Return only projects that belong to the company', async () => {
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(1);
    expect(response.jsonBody[0].belongsToCompany).toBe('company1');
  });

});

describe('Application admin', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
    });
  });

  test('Return all projects', async () => {
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(3);
  });
});

describe('errors', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  test('return error on fetching geojsons', async () => {
    jest.spyOn(mockGeoJsonService, 'queryGeoJson').mockRejectedValue(new Error('Database error'));
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(500);
  });

  test('Return 500 Internal Server Error', async () => {
    jest.spyOn(mockProjectService, 'queryProjects').mockRejectedValue(new Error('Database error'));
    const response = await getProjectsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ error: 'Database error' });
  });
});

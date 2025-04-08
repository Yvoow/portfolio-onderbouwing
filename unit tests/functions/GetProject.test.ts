import { getProjectHandler } from "../../functions/GetProject";
import { ProjectService } from "../../services/ProjectService";
import { GeoJsonService } from "../../services/GeoJsonService";
import { EnumsService } from "../../services/EnumsService";
import { MockDatabaseClient as GeoJsonMockDatabaseClient } from "../mocks/MockGeoJsonClient";
import { MockDatabaseClient as ProjectMockDatabaseClient } from "../mocks/MockProjectClient";
import { MockDatabaseClient as EnumsMockDatabaseClient } from "../mocks/MockEnumsClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockProjectDatabaseClient = new ProjectMockDatabaseClient();
const mockEnumsDatabaseClient = new EnumsMockDatabaseClient();
const mockGeoJsonDatabaseClient = new GeoJsonMockDatabaseClient();
const mockProjectService = new ProjectService(mockProjectDatabaseClient);
const mockEnumsService = new EnumsService(mockEnumsDatabaseClient);
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
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('400 Bad Request', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 400 Bad Request', async () => {
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(400);
    expect(response.jsonBody).toEqual({ error: 'Project ID is required' });
  });
});

describe('404 Not Found', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 404 Not Found', async () => {
    mockRequest.params.projectId = '123';
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ error: 'Project with id 123 not found' });
  });
});

describe('Get project by ID', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return project by ID', async () => {
    mockRequest.params.projectId = 'project1';
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('id', 'project1');
  });

  test('Return project by ID with company ID', async () => {
    mockRequest.params.projectId = 'project1';
    mockRequest.query.set('companyId', 'company1');
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('id', 'project1');
  });
});

describe('Context errors', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Warn on fetching project type', async () => {
    mockRequest.params.projectId = 'project1';
    jest.spyOn(mockEnumsDatabaseClient, 'queryEnumerations').mockRejectedValue(new Error('Database error'));
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
  });

  test('Warn on fetching project status', async () => {
    mockRequest.params.projectId = 'project1';
    jest.spyOn(mockEnumsDatabaseClient, 'queryEnumerations').mockRejectedValue(new Error('Database error'));
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
  });

  test('Warn on fetching company', async () => {
    mockRequest.params.projectId = 'project1';
    jest.spyOn(mockProjectDatabaseClient, 'queryCompany').mockRejectedValue(new Error('Database error'));
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
  });

  test('Warn on fetching geojsons', async () => {
    mockRequest.params.projectId = 'project1';
    jest.spyOn(mockGeoJsonDatabaseClient, 'queryGeoJson').mockRejectedValue(new Error('Database error'));
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
  });
});

describe('500 error on fetching project', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 500 Internal Server Error', async () => {
    mockRequest.params.projectId = 'project1';
    jest.spyOn(mockProjectDatabaseClient, 'getProjectById').mockRejectedValue(new Error('Database error'));
    const response = await getProjectHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService,
      mockEnumsService,
      mockGeoJsonService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ error: 'An error occurred: Database error' });
  });
});

import { getSectionsMapHandler } from "../../functions/GetSectionsMap";
import { SectionService } from "../../services/SectionService";
import { GeoJsonService } from "../../services/GeoJsonService";
import { MockDatabaseClient as SectionMockDatabaseClient } from "../mocks/MockSectionClient";
import { MockDatabaseClient as GeoJsonMockDatabaseClient } from "../mocks/MockGeoJsonClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockSectionDatabaseClient = new SectionMockDatabaseClient();
const mockGeoJsonDatabaseClient = new GeoJsonMockDatabaseClient();
const mockSectionService = new SectionService(mockSectionDatabaseClient);
const mockGeoJsonService = new GeoJsonService(mockGeoJsonDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockSectionDatabaseClient);
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
    const response = await getSectionsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('Authorized user with no projects', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: []
    });
  });

  test('Return 404 No sections found', async () => {
    mockRequest.params.projectId = 'project1';
    const response = await getSectionsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ message: 'No sections found' });
  });
});

describe('Authorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [
        {
          id: 'project1',
          role: 'admin',
          sections: [
            {
              id: 'section1',
              role: "noaccess",
              permissions: ['noaccess'],
            }
          ]
        }
      ]
    });
  });

  test('Return result with projectId', async () => {
    mockRequest.params.projectId = 'project1';
    const response = await getSectionsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(1); // omdat je eentje wegfiltert met perms
  });

  test('No section found', async () => {
    mockRequest.params.projectId = 'NOIDFOUND';
    const response = await getSectionsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ message: 'No sections found' });
  });

});

describe('Internal server error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue(new Error('Internal server error'));
  });

  test('Return 500 Internal server error', async () => {
    const response = await getSectionsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockGeoJsonService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ message: 'An error occurred: Internal server error' });
  });
});

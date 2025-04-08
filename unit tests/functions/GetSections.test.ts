import { getSectionsHandler } from "../../functions/GetSections";
import { SectionService } from "../../services/SectionService";
import { LocationService } from "../../services/LocationService";
import { MockDatabaseClient as SectionMockDatabaseClient } from "../mocks/MockSectionClient";
import { MockDatabaseClient as LocationMockDatabaseClient } from "../mocks/MockLocationClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockSectionDatabaseClient = new SectionMockDatabaseClient();
const mockLocationDatabaseClient = new LocationMockDatabaseClient();
const mockSectionService = new SectionService(mockSectionDatabaseClient);
const mockLocationService = new LocationService(mockLocationDatabaseClient);

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
    const response = await getSectionsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService
    );

    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('Authenticated user with params', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [
        { id: 'project1', role: 'read', sections: [{id: 'section4', role: 'noaccess'}] },
        { id: 'project2', role: 'read' },
      ]
    });
    mockRequest.query.set('whereName', 'Section 1');
    mockRequest.query.set('whereCode', 'S001');
    mockRequest.query.set('belongsToProject', 'project1');
  });

  test('Return 200 OK with sections', async () => {
    const response = await getSectionsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService
    );

    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count', 1);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data.length).toBe(1);
  });
});

describe('Authenticated user with projectIds', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [
        { id: 'project1', role: 'read', sections: [{id: 'section4', role: 'noaccess'}] },
        { id: 'project2', role: 'read' },
      ]
    });
    mockRequest.query.set('projectIds[]', 'project1, project2');
    mockRequest.query.set('orderBy', 'name');
    mockRequest.query.set('order', 'desc');
  });

  test('Return 200 OK with sections', async () => {
    const response = await getSectionsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService
    );

    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count', 2);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data.length).toBe(2);
  });
});

describe('500 Internal Server Error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
    jest.spyOn(mockSectionDatabaseClient, 'querySections').mockRejectedValue(new Error('Database error'));
  });

  test('Return 500 Internal Server Error', async () => {
    const response = await getSectionsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService
    );

    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ message: 'Internal Server Error' });
  });
});

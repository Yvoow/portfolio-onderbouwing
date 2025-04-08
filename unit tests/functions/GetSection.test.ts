import { getSectionHandler } from "../../functions/GetSection";
import { SectionService } from "../../services/SectionService";
import { LocationService } from "../../services/LocationService";
import { PointService } from "../../services/PointService";
import { GeoJsonService } from "../../services/GeoJsonService";
import { EnumsService } from "../../services/EnumsService";
import { MockDatabaseClient as SectionMockDatabaseClient } from "../mocks/MockSectionClient";
import { MockDatabaseClient as LocationMockDatabaseClient } from "../mocks/MockLocationClient";
import { MockDatabaseClient as PointMockDatabaseClient } from "../mocks/MockPointClient";
import { MockDatabaseClient as GeoJsonMockDatabaseClient } from "../mocks/MockGeoJsonClient";
import { MockDatabaseClient as EnumsMockDatabaseClient } from "../mocks/MockEnumsClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockSectionDatabaseClient = new SectionMockDatabaseClient();
const mockLocationDatabaseClient = new LocationMockDatabaseClient();
const mockPointDatabaseClient = new PointMockDatabaseClient();
const mockGeoJsonDatabaseClient = new GeoJsonMockDatabaseClient();
const mockEnumsDatabaseClient = new EnumsMockDatabaseClient();
const mockSectionService = new SectionService(mockSectionDatabaseClient);
const mockLocationService = new LocationService(mockLocationDatabaseClient);
const mockPointService = new PointService(mockPointDatabaseClient);
const mockGeoJsonService = new GeoJsonService(mockGeoJsonDatabaseClient);
const mockEnumsService = new EnumsService(mockEnumsDatabaseClient);

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
    const response = await getSectionHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService,
      mockPointService,
      mockGeoJsonService,
      mockEnumsService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('Authorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return result with projectId', async () => {
    mockRequest.params.sectionId = 'section1';
    mockRequest.query.set('projectId', 'project1');
    const response = await getSectionHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService,
      mockPointService,
      mockGeoJsonService,
      mockEnumsService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('id', 'section1');
    expect(response.jsonBody).toHaveProperty('belongsToProject', 'project1');
  });

  test('No section found', async () => {
    mockRequest.params.sectionId = 'NOIDFOUND';
    const response = await getSectionHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService,
      mockPointService,
      mockGeoJsonService,
      mockEnumsService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ message: 'Section with id NOIDFOUND not found' });
  });
});

describe('500 Internal Server Error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 500 Internal Server Error', async () => {
    mockRequest.params.sectionId = 'section1';
    jest.spyOn(mockSectionDatabaseClient, 'querySections').mockRejectedValue(new Error('Database error'));
    const response = await getSectionHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockSectionService,
      mockLocationService,
      mockPointService,
      mockGeoJsonService,
      mockEnumsService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ message: 'An error occurred: Database error' });
  });
});

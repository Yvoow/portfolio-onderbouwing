import { getLocationsAndPointsMapHandler } from "../../functions/GetLocationsAndPointsMap";
import { MockDatabaseClient as MockEnumsDatabaseClient } from "../mocks/MockEnumsClient";
import { MockDatabaseClient as MockPointsDatabaseClient } from "../mocks/MockPointClient";
import { MockDatabaseClient as MockLocationsDatabaseClient } from "../mocks/MockLocationClient";
import { AuthService } from "../../services/AuthenticationService";
import { LocationService } from "../../services/LocationService";
import { PointService } from "../../services/PointService";
import { EnumsService } from "../../services/EnumsService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockEnumsDatabaseClient = new MockEnumsDatabaseClient();
const mockPointsDatabaseClient = new MockPointsDatabaseClient();
const mockLocationsDatabaseClient = new MockLocationsDatabaseClient();
const mockEnumsService = new EnumsService(mockEnumsDatabaseClient);
const mockPointService = new PointService(mockPointsDatabaseClient);
const mockLocationService = new LocationService(mockLocationsDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockLocationsDatabaseClient);
jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
  isApplicationAdmin: false,
  isCompanyAdmin: false,
});

// Mock request and context
let mockRequest = {
  query: new URLSearchParams(),
  params: { sectionId: 'test' }
} as unknown as HttpRequest;
const mockContext = {
  error(...args: any[]): void {
    console.error;
  },
} as InvocationContext;

// Reset the request queries after each test
afterEach(() => {
  jest.restoreAllMocks();
  mockRequest = {
    query: new URLSearchParams(),
    params: { sectionId: 'test' }
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue(null);
  });

  test('Return unauthorized', async () => {
    const response = await getLocationsAndPointsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(401);
  });
});

describe('Get locations and points', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return locations and points', async () => {
    const response = await getLocationsAndPointsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(3);
    expect(response.jsonBody[0]).toHaveProperty('points');
    expect(response.jsonBody[0].points).toHaveLength(2);
    expect(response.jsonBody[0].points[0]).toHaveProperty('typeMonitoringsPoint');
    expect(response.jsonBody[0].points[0].typeMonitoringsPoint).toHaveProperty('label');
    expect(response.jsonBody[0].points[0].typeMonitoringsPoint.label).toBe('Water level');
  });
});

describe('No locations found', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
    jest.spyOn(mockLocationService, "queryLocations").mockResolvedValue([]);
  });

  test('Return 404', async () => {
    const response = await getLocationsAndPointsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(404);
  });
});

describe('500 return on error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
    jest.spyOn(mockLocationService, "queryLocations").mockRejectedValue(new Error('Test error'));
  });

  test('Return error', async () => {
    const response = await getLocationsAndPointsMapHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toHaveProperty('error');
    expect(response.jsonBody.error).toBe('Test error');
  });
});

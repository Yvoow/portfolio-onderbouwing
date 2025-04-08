import { LocationService } from "../../services/LocationService";
import { getMeasureLocationsHandler } from "../../functions/GetMeasureLocations";
import { MockDatabaseClient } from "../mocks/MockLocationClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockLocationService = new LocationService(mockDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockDatabaseClient);
jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
  isApplicationAdmin: false,
  isCompanyAdmin: false,
});

// Mock request and context
let mockRequest = {
  query: new URLSearchParams(),
} as unknown as HttpRequest;
const mockContext = {
  error(...args: any[]): void { console.error }
} as InvocationContext;

// Reset the request queries after each test
afterEach(() => {
  jest.resetAllMocks();
  mockRequest = {
    query: new URLSearchParams(),
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });

  test('Return 401 Unauthorized', async () => {
    const response = await getMeasureLocationsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('Get measure locations with params', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  test('Return measure locations with whereName', async () => {
    mockRequest.query.set('whereName', 'Locatie 1');
    const response = await getMeasureLocationsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count', 1);
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('Return measure locations with belongsToSection', async () => {
    mockRequest.query.set('belongsToSection', 'section1');
    const response = await getMeasureLocationsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count', 2);
    expect(response.jsonBody.data).toHaveLength(2);
  });

  test('Return measure locations with sectionIds[]', async () => {
    mockRequest.query.set('sectionIds[]', 'section1,Section2');
    const response = await getMeasureLocationsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count', 3);
    expect(response.jsonBody.data).toHaveLength(3);
  });
});

describe('Get measure locations with pagination', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return measure locations with pagination', async () => {
    mockRequest.query.set('pageSize', '2');
    mockRequest.query.set('pageNumber', '2');
    const response = await getMeasureLocationsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count', 3);
    expect(response.jsonBody.data).toHaveLength(1);
  });
});

describe('Get measure locations with errors', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 500 Internal Server Error', async () => {
    jest.spyOn(mockLocationService, 'getLocations').mockRejectedValue(new Error('Database error'));
    const response = await getMeasureLocationsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockLocationService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ message: 'Internal Server Error' });
  });
});

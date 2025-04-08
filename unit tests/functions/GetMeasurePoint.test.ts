import { PointService } from "../../services/PointService";
import { EnumsService } from "../../services/EnumsService";
import { getPointHandler } from "../../functions/GetMeasurePoint";
import { MockDatabaseClient as pointMockDatabaseClient } from "../mocks/MockPointClient";
import { MockDatabaseClient as enumsMockDatabaseClient } from "../mocks/MockEnumsClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockPointDatabaseClient = new pointMockDatabaseClient();
const mockEnumsDatabaseClient = new enumsMockDatabaseClient();
const mockPointService = new PointService(mockPointDatabaseClient);
const mockEnumsService = new EnumsService(mockEnumsDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockPointDatabaseClient);
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
    const response = await getPointHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService,
      mockEnumsService
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
    const response = await getPointHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(400);
    expect(response.jsonBody).toEqual({ error: 'Location ID is required' });
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
    mockRequest.params.pointId = '123';
    mockRequest.query.set('locationId', '123');
    const response = await getPointHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ error: 'Point with id 123 not found' });
  });
});

describe('point found', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return point with attachments', async () => {
    mockRequest.params.pointId = '1';
    mockRequest.query.set('locationId', '1');
    const response = await getPointHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('attachments');
    expect(response.jsonBody).toHaveProperty('boreholeLog');
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
    jest.spyOn(mockPointService, 'queryPointById').mockRejectedValue(new Error('Database error'));
    mockRequest.params.pointId = '123';
    mockRequest.query.set('locationId', '123');
    const response = await getPointHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService,
      mockEnumsService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ error: 'An error occurred: Database error' });
  });
});

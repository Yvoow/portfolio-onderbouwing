import { PointService } from "../../services/PointService";
import { HttpRequest, InvocationContext } from "@azure/functions";
import { getMeasurePointsHandler } from "../../functions/GetMeasurePoints";
import { MockDatabaseClient } from "../mocks/MockPointClient";
import { AuthService } from "../../services/AuthenticationService";

// Use the mock DatabaseClient
const mockPointDatabaseClient = new MockDatabaseClient();
const mockPointService = new PointService(mockPointDatabaseClient);

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
  headers: {},
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
    headers: {},
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });

  test('Return 401 Unauthorized', async () => {
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('builds the query', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  test('returns all points', async () => {
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(3);
  });

  test('returns points with relative depth', async () => {
    mockRequest.query.set('relativeDepth', '2');
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('returns points with name', async () => {
    mockRequest.query.set('whereName', 'Point 1');
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('returns points with monitoring location', async () => {
    mockRequest.query.set('belongsToMonitoringLocation', '1');
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(2);
  });

  test('returns points with multiple monitoring locations', async () => {
    mockRequest.query.set('belongsToMonitoringLocations[]', '1,2');
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(3);
  });

  test('returns points with page size', async () => {
    mockRequest.query.set('pageSize', '2');
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(2);
  });

  test('returns points with page size and continuation', async () => {
    mockRequest.query.set('pageSize', '2');
    mockRequest.headers['x-ms-continuation'] = '1';
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(2);
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
    jest.spyOn(mockPointService, 'getPoints').mockRejectedValue(new Error('Internal Server Error'));
    const response = await getMeasurePointsHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockPointService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ message: 'Internal Server Error' });
  });
});

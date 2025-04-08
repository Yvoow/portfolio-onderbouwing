import { getInclinoChartHandler } from "../../functions/GetInclinoChart";
import { MockDatabaseClient } from "../mocks/MockMeasurevaluesClient";
import { AuthService } from "../../services/AuthenticationService";
import { MeasurevalueService } from "../../services/MeasurevalueService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockMeasurevaluesDatabaseClient = new MockDatabaseClient();
const mockMeasurevalueService = new MeasurevalueService(mockMeasurevaluesDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockMeasurevaluesDatabaseClient);
jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
  isApplicationAdmin: false,
  isCompanyAdmin: false,
});

// Mock request and context
let mockRequest = {
  query: new URLSearchParams(),
  params: { 'measure-point': 'test', quantity: 'test', condition: 'test' }
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
    params: {}
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue(null);
  });

  test('Return unauthorized', async () => {
    const response = await getInclinoChartHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(401);
  });
});

describe('Authorized user with params', () => {
  let mockRequest = {
    query: new URLSearchParams(),
    params: { 'measure-point': '1234', quantity: 'water_level', condition: 'reference' }
  } as unknown as HttpRequest;
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return data with monitoringpoint', async () => {
    const response = await getInclinoChartHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(1)
  });

});

describe('404 error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
    jest.spyOn(mockMeasurevalueService, "queryMeasureValues").mockRejectedValue(new Error('Not found'));
  });

  test('Return 404', async () => {
    const response = await getInclinoChartHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(404);
  });
});

describe('500 error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockRejectedValue(new Error('Internal Server Error'));
  });

  test('Return 500', async () => {
    const response = await getInclinoChartHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(500);
  });
});

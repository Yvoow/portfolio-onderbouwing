import { getChartSerieHandler } from "../../functions/GetChartSerie";
import { MockDatabaseClient } from "../mocks/MockChartClient";
import { AuthService } from "../../services/AuthenticationService";
import { ChartService } from "../../services/ChartService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockChartService = new ChartService(mockDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockDatabaseClient);
jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
  isApplicationAdmin: false,
  isCompanyAdmin: false,
});

// Mock request and context
let mockRequest = {
  query: new URLSearchParams(),
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
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue(null);
  });

  test('Return unauthorized', async () => {
    const response = await getChartSerieHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockChartService
    );
    expect(response.status).toBe(401);
  });
});

describe('Get 24H values', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 24H values', async () => {
    mockRequest.query.set('timeSpan', '24H');
    mockRequest.query.set('measure-point', '1');
    mockRequest.query.set('condition', 'condition1');
    mockRequest.query.set('quantity', 'quantity1');
    mockRequest.query.set('start', '161213760000');
    mockRequest.query.set('end', '16121376000000');

    const response = await getChartSerieHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockChartService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(1);
  });
});

describe('Get all values', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return all values with param', async () => {
    mockRequest.query.set('timeSpan', 'All');
    mockRequest.query.set('measure-point', '1');
    mockRequest.query.set('condition', 'condition1');
    mockRequest.query.set('quantity', 'quantity1');
    mockRequest.query.set('start', '161213760000');
    mockRequest.query.set('end', '16121376000000');

    const response = await getChartSerieHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockChartService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(1);
  });

  test('Return all values without param', async () => {
    mockRequest.query.set('measure-point', '1');
    mockRequest.query.set('condition', 'condition1');
    mockRequest.query.set('quantity', 'quantity1');
    mockRequest.query.set('start', '161213760000');
    mockRequest.query.set('end', '16121376000000');

    const response = await getChartSerieHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockChartService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveLength(1);
  });
});

describe('Error fetching values', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return not found', async () => {
    mockRequest.query.set('timeSpan', '24H');
    mockRequest.query.set('measure-point', 'notFound');
    mockRequest.query.set('condition', 'condition1');
    mockRequest.query.set('quantity', 'quantity1');
    mockRequest.query.set('start', '161213760000');
    mockRequest.query.set('end', '16121376000000');

    jest.spyOn(mockChartService, 'get24HValues').mockRejectedValue(new Error('internal error'));
    const response = await getChartSerieHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockChartService
    );
    expect(response.status).toBe(404);
  });
});

describe('Internal server error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, "authenticate").mockRejectedValue('Internal error');
  });

  test('Return internal server error', async () => {
    mockRequest.query.set('timeSpan', '24H');
    mockRequest.query.set('measure-point', '1');
    mockRequest.query.set('condition', 'condition1');
    mockRequest.query.set('quantity', 'quantity1');
    mockRequest.query.set('start', '161213760000');
    mockRequest.query.set('end', '16121376000000');

    const response = await getChartSerieHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockChartService
    );
    expect(response.status).toBe(500);
  });
});

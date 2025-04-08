import { MeasurevalueService } from "../../services/MeasurevalueService";
import  { createMeasureValueHandler } from "../../functions/CreateMeasureValue";
import { AuthService } from "../../services/AuthenticationService";
import { MockDatabaseClient } from "../mocks/MockMeasurevaluesClient";
import { HttpRequest, InvocationContext } from '@azure/functions';

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockMeasurevalueService = new MeasurevalueService(mockDatabaseClient);

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
  mockRequest = {
    query: new URLSearchParams(),
  } as unknown as HttpRequest;
});

// Tests
describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });
  test('Return unauthorized', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(401);
  });
});

describe('Bad request', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({}),
  } as unknown as HttpRequest;
  mockContext = {
    error(...args: any[]): void { console.error }
  } as InvocationContext;
  test('Return bad request', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(400);
  });
});

describe('Create value', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      typeMeasurementValue: 'water_level',
      belongsToMonitoringPoint: '134316111',
      datetime: '2024-01-01T17:00:00Z',
      unit: 'm',
      quantity: 'water_level',
      condition: 'reference',
      value: 9.503,
      manualMeasurement: false,
    }),
  } as unknown as HttpRequest;
  test('Return created value', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(200);
  });
});

describe('500 on failure creating value', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      typeMeasurementValue: 'water_level',
      belongsToMonitoringPoint: '1341341',
      datetime: '2024-01-01T17:00:00Z',
      unit: 'm',
      quantity: 'water_level',
      condition: 'reference',
      value: 9.503,
      manualMeasurement: false,
    }),
  } as unknown as HttpRequest;
  test('Return 500 on failure', async () => {
    jest.spyOn(mockMeasurevalueService, 'createMeasureValue').mockResolvedValue(null);
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(500);
  });
});

describe('500 error', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockRejectedValue('Error'),
  } as unknown as HttpRequest;
  test('Return 500 on error', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(500);
  });
});

describe('invalid value format', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      typeMeasurementValue: 'water_level',
      belongsToMonitoringPoint: '136143',
      datetime: '2024-01-01T17:00:00Z',
      unit: 'm',
      quantity: 'water_level',
      condition: 'reference',
      value: 'invalid',
      manualMeasurement: false,
    }),
  } as unknown as HttpRequest;
  test('Return 400 on invalid value', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(400);
  });
});

describe('not finite value', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      typeMeasurementValue: 'water_level',
      belongsToMonitoringPoint: '5153156',
      datetime: '2024-01-01T17:00:00Z',
      unit: 'm',
      quantity: 'water_level',
      condition: 'reference',
      value: 0,
      manualMeasurement: false,
    }),
  } as unknown as HttpRequest;
  test('Return 400 on not finite value', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(400);
  });
});

describe('Empty string is not a valid number 400', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      typeMeasurementValue: 'water_level',
      belongsToMonitoringPoint: '161341',
      datetime: '2024-01-01T17:00:00Z',
      unit: 'm',
      quantity: 'water_level',
      condition: 'reference',
      value: '  ',
      manualMeasurement: false,
    }),
  } as unknown as HttpRequest;
  test('Return 400 on empty string', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(400);
  });
});

describe('convert string with whitespace to number', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      typeMeasurementValue: 'water_level',
      belongsToMonitoringPoint: '135136',
      datetime: '2024-12-01T17:00:00Z',
      unit: 'm',
      quantity: 'water_level',
      condition: 'reference',
      value: '9.503 ',
      manualMeasurement: false,
    }),
  } as unknown as HttpRequest;
  test('Return 200 on converted value', async () => {
    const response = await createMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(200);
  });
});



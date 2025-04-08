import { MeasurevalueService } from "../../services/MeasurevalueService";
import { deleteMeasureValueHandler } from "../../functions/DeleteMeasureValue";
import { AuthService } from "../../services/AuthenticationService";
import { MockDatabaseClient } from "../mocks/MockMeasurevaluesClient";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockMeasurevalueService = new MeasurevalueService(mockDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockDatabaseClient);
jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
  isApplicationAdmin: true,
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
  jest.restoreAllMocks();
  mockRequest = {
    query: new URLSearchParams(),
  } as unknown as HttpRequest;
});

//Tests
describe("Unauthenticated user", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue(null);
  });
  test("Return unauthorized", async () => {
    const response = await deleteMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(401);
  });
});

describe("Measure value not found", () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, "authenticate").mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    params: { id: "NOTFOUNDDDD" }
  } as unknown as HttpRequest;
  test("Return not found", async () => {
    const response = await deleteMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(404);
  });
});

describe('Delete measure value', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    params: { id: '1' }
  } as unknown as HttpRequest;
  test('Return 200', async () => {
    const response = await deleteMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(200);
  });
});

describe('500 error', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
  } as unknown as HttpRequest;
  test('Return 500', async () => {
    const response = await deleteMeasureValueHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockMeasurevalueService
    );
    expect(response.status).toBe(500);
  });
});

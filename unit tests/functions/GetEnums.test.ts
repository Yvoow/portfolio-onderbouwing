import { getEnumsHandler } from "../../functions/GetEnums";
import { MockDatabaseClient } from "../mocks/MockEnumsClient";
import { EnumsService } from "../../services/EnumsService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockEnumsService = new EnumsService(mockDatabaseClient);

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
describe('200 return on enums', () => {
  test('Return enums', async () => {
    const response = await getEnumsHandler(
      mockRequest,
      mockContext,
      mockEnumsService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(7);
  });
});

describe('500 return on error', () => {
  test('Return error', async () => {
    jest.spyOn(mockEnumsService, 'fetchEnums').mockRejectedValue(new Error('Test error'));
    const response = await getEnumsHandler(
      mockRequest,
      mockContext,
      mockEnumsService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toHaveProperty('error');
    expect(response.jsonBody.error).toBe('Test error');
  });
});

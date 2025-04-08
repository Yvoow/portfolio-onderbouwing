import { EnumsService } from "../../services/EnumsService";
import { patchRoleHandler } from "../../functions/PatchRole";
import { MockDatabaseClient } from "../mocks/MockEnumsClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockEnumsClient = new MockDatabaseClient();
const mockEnumsService = new EnumsService(mockEnumsClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockEnumsClient);
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
    const response = await patchRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual('Unauthorized');
  });
});

describe('Authorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 401 Unauthorized', async () => {
    const response = await patchRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual('Unauthorized');
  });
});

describe('Application admin with request to set default role', () => {
  let mockRequest = {
    query: new URLSearchParams(),
    params: { id: 'read' },
    json: async () => [{ path: '/defaultrole', value: true }],
  } as unknown as HttpRequest;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });

  test('Return 409 Conflict', async () => {
    const response = await patchRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(409);
    expect(response.jsonBody).toEqual({ error: 'There can only be one default role' });
  });

  test('Return 404 Not Found', async () => {
    mockRequest.params.id = 'notfound';
    const response = await patchRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ error: 'No role with id notfound found' });
  });

});

describe('Application admin with request to patch role', () => {
  let mockRequest = {
    query: new URLSearchParams(),
    params: { id: 'read' },
    json: async () => [{ path: '/permissions', value: ['read', 'write'] }],
  } as unknown as HttpRequest;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });

  test('Return 200 OK', async () => {
    const response = await patchRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      id: 'read',
      permissions: ['read', 'write'],
      defaultrole: true,
      type: 'Role'
    });
  });
});

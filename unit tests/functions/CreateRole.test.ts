import { EnumsService } from "../../services/EnumsService";
import { createRoleHandler } from "../../functions/CreateRole";
import { AuthService } from '../../services/AuthenticationService';
import { MockDatabaseClient } from "../mocks/MockEnumsClient";
import { HttpRequest, InvocationContext } from '@azure/functions';

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockEnumsService = new EnumsService(mockDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockDatabaseClient);
jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
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

// Tests
describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });
  test('Return unauthorized', async () => {
    const response = await createRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
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
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({}),
  } as unknown as HttpRequest;
  test('Return bad request', async () => {
    const response = await createRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(400);
  });
});

describe('Create role', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      name: 'newRole',
      permissions: ['read', 'write'],
    }),
  } as unknown as HttpRequest;
  test('Create role', async () => {
    const response = await createRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(200);
  });
});

describe('Role already exists', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      name: 'read',
      permissions: ['read', 'write'],
    }),
  } as unknown as HttpRequest;
  test('Role already exists', async () => {
    const response = await createRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(409);
  });
});

describe('500 error failed to create role', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      name: 'ttt',
      permissions: ['read', 'write'],
    }),
  } as unknown as HttpRequest;
  test('500 error failed to create role', async () => {
    jest.spyOn(mockEnumsService, 'createEnum').mockRejectedValue(new Error('Failed to create role'));
    const response = await createRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(500);
  });
});

describe('500 error internal error', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue(new Error('Internal error'));
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      name: 'ttt',
      permissions: ['read', 'write'],
    }),
  } as unknown as HttpRequest;
  test('500 error internal error', async () => {
    const response = await createRoleHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockEnumsService
    );
    expect(response.status).toBe(500);
  });
});

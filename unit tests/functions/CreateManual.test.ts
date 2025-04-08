import { ManualService } from "../../services/ManualService";
import { createManualHandler } from "../../functions/CreateManual";
import { AuthService } from '../../services/AuthenticationService';
import { MockDatabaseClient } from "../mocks/MockManualClient";
import { HttpRequest, InvocationContext } from '@azure/functions';

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockManualService = new ManualService(mockDatabaseClient);

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
describe('Authenticated user without application admin rights', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });
  test('Return unauthorized', async () => {
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(401);
  });
});

describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });
  test('Return unauthorized', async () => {
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(401);
  });
});

describe('Bad request', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
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
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(400);
  });
});

describe('Create manual', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      title: 'New Manual',
      content: 'Content',
    }),
  } as unknown as HttpRequest;
  mockContext = {
    error(...args: any[]): void { console.error }
  } as InvocationContext;
  test('Return 200 on normal', async () => {
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(200);
  });
});

describe('Create manual with belongsTo', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      title: 'New Manual',
      content: 'Content',
      belongsTo: 'Parent Manual',
    }),
  } as unknown as HttpRequest;
  mockContext = {
    error(...args: any[]): void { console.error }
  } as InvocationContext;
  test('Return 200 on normal', async () => {
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(200);
  });
});

describe('Status 500 on creating manual', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockResolvedValue({
      title: 'New Manual',
      content: 'Content',
    }),
  } as unknown as HttpRequest;
  mockContext = {
    error(...args: any[]): void { console.error }
  } as InvocationContext;
  test('Return 500 on error', async () => {
    jest.spyOn(mockManualService, 'createManual').mockResolvedValue(null);
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(500);
  });
});

describe('Status 500 on error', () => {
  let mockRequest: HttpRequest;
  let mockContext: InvocationContext;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
    });
  });
  mockRequest = {
    query: new URLSearchParams(),
    json: jest.fn().mockRejectedValue('Error'),
  } as unknown as HttpRequest;
  mockContext = {
    error(...args: any[]): void { console.error }
  } as InvocationContext;
  test('Return 500 on error', async () => {
    const response = await createManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(500);
  });
});

import { ManualService } from "../../services/ManualService";
import { deleteManualHandler } from "../../functions/DeleteManual";
import { AuthService } from '../../services/AuthenticationService';
import { MockDatabaseClient } from "../mocks/MockManualClient";
import { HttpRequest, InvocationContext } from '@azure/functions';

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockManualService = new ManualService(mockDatabaseClient);

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

//Tests
describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });
  test('Return unauthorized', async () => {
    const response = await deleteManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(401);
  });
});

describe('Manual not found', () => {
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
    params: { id: 'notFound' }
  } as unknown as HttpRequest;
  test('Return not found', async () => {
    const response = await deleteManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(404);
  });
});

describe('Delete manual', () => {
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
    params: { id: 'manual2' }
  } as unknown as HttpRequest;
  test('Return manual deleted', async () => {
    const response = await deleteManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(200);
  });
});

describe('Internal error', () => {
  let mockRequest: HttpRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue('Internal error');
  });
  mockRequest = {
    query: new URLSearchParams(),
    params: { id: 'manual2' }
  } as unknown as HttpRequest;
  test('Return internal error', async () => {
    const response = await deleteManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(500);
  });
});

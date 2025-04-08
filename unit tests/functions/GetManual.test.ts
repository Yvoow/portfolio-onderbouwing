import { ManualService } from './../../services/ManualService';
import { getManualHandler } from '../../functions/GetManual';
import { MockDatabaseClient } from '../mocks/MockManualClient';
import { AuthService } from '../../services/AuthenticationService';
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
  test('Return published manual by ID', async () => {
    mockRequest = {
      ...mockRequest,
      params: { manualID: 'manual4' }
    }
    const response = await getManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.jsonBody).toHaveProperty('id', 'manual4');
  });

  test('Return manual with children', async () => {
    mockRequest = {
      ...mockRequest,
      params: { manualID: 'manual5' }
    }
    const response = await getManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.jsonBody).toHaveProperty('children');
  });

  test('Return published manual with historyversions', async() => {
    mockRequest = {
      ...mockRequest,
      params: { manualID: 'manual6' }
    }
    const response = await getManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.jsonBody).toHaveProperty('historyVersions');
  });

  test('Return no manual for unpublished search', async () => {
    mockRequest = {
      ...mockRequest,
      params: { manualID: 'manual3' }
    }
    const response = await getManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.jsonBody).toHaveProperty('message', 'Manual not found');
  });

});

describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });

  test('Return unauthorized', async () => {
    const response = await getManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toHaveProperty('message', 'Unauthorized');
  });
});

describe('Handle internal server error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue(null);
  });

  test('500 internal server error', async() => {
    const response = await getManualHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toHaveProperty('message', 'Internal Server Error');
  });
});

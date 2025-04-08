import { ManualService } from './../../services/ManualService';
import { getManualsListHandler } from '../../functions/GetManualsList';
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

  test('Return only published manuals (structured)', async () => {
    const response = await getManualsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveLength(2);
  });
});

describe('Authenticated user with application admin rights', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });

  test('Return all manuals (structured)', async () => {
    const response = await getManualsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveLength(2);
  });

  test('Return only published manuals (structured)', async () => {
    mockRequest.query.set('onlyPublished', 'true');
    const response = await getManualsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveLength(2);
  });
});

describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });

  test('Return unauthorized', async () => {
    const response = await getManualsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toHaveProperty('message', 'Unauthorized');
  });
});

// Important: this test must be the last one because Jest will mock the re
test('Handle internal server error', async () => {
  jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
    isApplicationAdmin: true,
    isCompanyAdmin: false,
  });
  jest.spyOn(mockManualService, 'getManuals').mockRejectedValue(new Error('Internal Error'));

  const response = await getManualsListHandler(
    mockRequest,
    mockContext,
    mockAuthService,
    mockManualService
  );

  expect(response.status).toBe(500);
  expect(response.jsonBody).toHaveProperty('message', 'Internal Server Error');
});

describe('No manuals found', () => {
  beforeEach(() => {
    jest.spyOn(mockManualService, 'getManuals').mockResolvedValue([]);
  });

  test('Return empty array', async () => {
    const response = await getManualsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockManualService
    );
    expect(response.status).toBeUndefined();
  });
});

test('Handle internal server error', async () => {
  jest.spyOn(mockManualService, 'getManuals').mockRejectedValue(new Error('Internal Error'));

  const response = await getManualsListHandler(
    mockRequest,
    mockContext,
    mockAuthService,
    mockManualService
  );

  expect(response.status).toBe(500);
  expect(response.jsonBody).toHaveProperty('message', 'Internal Server Error');
});

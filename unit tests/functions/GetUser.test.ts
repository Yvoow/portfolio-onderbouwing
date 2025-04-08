import { UserService } from './../../services/UserService';
import { getUserHandler } from "../../functions/GetUser";
import { MockDatabaseClient as mockuserdatabaseclient } from '../mocks/MockUserClient';
import { MockDatabaseClient as MockAuthClient } from '../mocks/MockAuthClient';
import { AuthService } from '../../services/AuthenticationService';
import { HttpRequest, InvocationContext } from '@azure/functions';

// Use the mock DatabaseClient
const mockUserDatabaseClient = new mockuserdatabaseclient();
const mockAuthClient = new MockAuthClient();
const mockUserService = new UserService(mockUserDatabaseClient);


// Mock AuthenticationService
const mockAuthService = new AuthService(mockAuthClient);
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
    const response = await getUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual({ message: 'Unauthorized' });
  });
});

describe('Authorized user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      belongsToCompany: 'company1',
      inviteAccepted: false,
    });
  });

  test('No userId', async () => {
    const response = await getUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(400);
    expect(response.jsonBody).toEqual({ message: 'Bad Request' });
  });

  test('Return user', async () => {
    mockRequest.params.userId = '5294875-ghg-3453';
    const response = await getUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('company');
    expect(response.jsonBody).toHaveProperty('userProjects');
    expect(response.jsonBody.userProjects[0]).toHaveProperty('permissions');
    expect(response.jsonBody.company).toHaveProperty('id', 'company1');
  });
});

describe('500 error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue(new Error('Test error'));
  });

  test('Return 500 error', async () => {
    const response = await getUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(500);
  });
});

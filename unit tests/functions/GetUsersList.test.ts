import { getUsersListHandler } from "../../functions/GetUsersList";
import { UserService } from "../../services/UserService";
import { MockDatabaseClient as UserMockDatabaseClient } from "../mocks/MockUserClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockUserDatabaseClient = new UserMockDatabaseClient();
const mockUserService = new UserService(mockUserDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockUserDatabaseClient);
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
    const response = await getUsersListHandler(
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
    });
  });

  test('Return only users from the same company', async () => {
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(2);
    expect(response.jsonBody.count).toBe(2);
  });

  test('Return users with mail', async () => {
    mockRequest.query.set('whereMail', 'y.heijltjes@geonius.nl');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(0);
    expect(response.jsonBody.count).toBe(0);
  });

});

describe('Application admin test params', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: true,
      isCompanyAdmin: false,
    });
  });

  test('Return users with mail', async () => {
    mockRequest.query.set('whereMail', 'y.heijltjes@geonius.nl');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(1);
    expect(response.jsonBody.count).toBe(1);
  });

  test('Return users with name', async () => {
    mockRequest.query.set('whereName', 'Yvo Heijltjes');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(1);
    expect(response.jsonBody.count).toBe(1);
  });

  test('Return users with username', async () => {
    mockRequest.query.set('whereUsername', 'y.heijltjes@geonius.nl');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(1);
    expect(response.jsonBody.count).toBe(1);
  });

  test('Return users with project', async () => {
    mockRequest.query.set('whereProject', 'project1');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(2);
    expect(response.jsonBody.count).toBe(2);
  });

  test('pagination', async () => {
    mockRequest.query.set('perPage', '1');
    mockRequest.query.set('page', '1');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(1);
    expect(response.jsonBody.count).toBe(2);
  });

  test('order and orderBy', async () => {
    mockRequest.query.set('orderBy', 'name');
    mockRequest.query.set('order', 'DESC');
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody).toHaveProperty('count');
    expect(response.jsonBody.data).toHaveLength(2);
    expect(response.jsonBody.count).toBe(2);
  });
});

describe('500 Internal Server Error', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue(new Error('Internal server error'));
  });

  test('Return 500 Internal server error', async () => {
    const response = await getUsersListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(500);
    expect(response.jsonBody).toEqual({ message: 'An error occurred: Internal server error' });
  });
});

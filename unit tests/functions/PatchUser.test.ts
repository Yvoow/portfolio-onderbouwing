import { UserService } from "../../services/UserService";
import { patchUserHandler } from "../../functions/PatchUser";
import { MockDatabaseClient } from "../mocks/MockUserClient";
import { AuthService } from "../../services/AuthenticationService";
import { HttpRequest, InvocationContext } from "@azure/functions";

// Use the mock DatabaseClient
const mockUserClient = new MockDatabaseClient();
const mockUserService = new UserService(mockUserClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockUserClient);
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
    const response = await patchUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(401);
    expect(response.jsonBody).toEqual('Unauthorized');
  });
});

describe('Authorized user', () => {
  let mockRequest = {
    query: new URLSearchParams(),
    params: {},
    json: async () => {
      return [
        {
          op: 'set',
          path: '/settings/language',
          value: 'en'
        }
      ];
    }
  } as unknown as HttpRequest;
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
    });
  });

  test('Return 404 Not Found', async () => {
    mockRequest.params.id = 'NOTFOUND';
    const response = await patchUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(404);
    expect(response.jsonBody).toEqual({ error: 'No user with id NOTFOUND found' });
  });

  test('Execute patchUser', async () => {
    mockRequest.params.id = '5294875-ghg-3453'
    const response = await patchUserHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockUserService
    );
    expect(response.status).toBe(200);
    expect(response.jsonBody).toHaveProperty('settings');
    expect(response.jsonBody.settings).toHaveProperty('language');
    expect(response.jsonBody.settings.language).toBe('en');
  });
});

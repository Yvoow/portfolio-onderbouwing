import { getProjectsListHandler } from '../../functions/GetProjectsList';
import { MockDatabaseClient } from '../mocks/MockProjectClient';
import { AuthService } from '../../services/AuthenticationService';
import { ProjectService } from '../../services/ProjectService';
import { HttpRequest, InvocationContext } from '@azure/functions';

// Use the mock DatabaseClient
const mockDatabaseClient = new MockDatabaseClient();
const mockProjectService = new ProjectService(mockDatabaseClient);

// Mock AuthenticationService
const mockAuthService = new AuthService(mockDatabaseClient);
jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
  isApplicationAdmin: false,
  isCompanyAdmin: false,
  userProjects: [{ id: 'project1', role: 'admin' }],
});

// Mock request and context
let mockRequest = {
  query: new URLSearchParams(),
} as unknown as HttpRequest;
const mockContext = {
  error(...args: any[]): void { console.error}
} as InvocationContext;

// Reset the request queries after each test
afterEach(() => {
  mockRequest = {
    query: new URLSearchParams(),
  } as unknown as HttpRequest;
});

// Tests
describe('Authenticated user with access to one project', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [{ id: 'project1', role: 'admin' }],
    });
  });

  test('Return paginated projects', async () => {
    mockRequest.query.set('perPage', '1');
    mockRequest.query.set('page', '1');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );
    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('Return all projects without pagination', async () => {
    mockRequest.query.delete('perPage');
    mockRequest.query.delete('page');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });
});

describe('Unauthenticated user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(null);
  });

  test('Return 401 if not authenticated', async () => {
    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );
    expect(response.status).toBe(401);
  });
});

describe('Authenticated user with access to multiple projects', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [
        { id: 'project1', role: 'admin' },
        { id: 'project2', role: 'admin' },
      ],
    });
  });

  test('Return projects filtered by company', async () => {
    mockRequest.query.set('belongsToCompany', 'company1');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('Return projects filtered by name', async () => {
    mockRequest.query.set('whereName', 'Project 1');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('Return projects filtered by code', async () => {
    mockRequest.query.set('whereCode', 'P001');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });

  test('Return projects ordered by name', async () => {
    mockRequest.query.set('orderBy', 'name');
    mockRequest.query.set('order', 'ASC');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(2);
  });
});

describe('Authenticated user with no access to any projects', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [],
    });
  });

  test('Return no projects if user has no access', async () => {
    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(0);
  });
});

describe('Authenticated company admin user', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: true,
      belongsToCompany: 'company1',
    });
  });

  test('Return projects filtered by company', async () => {
    mockRequest.query.set('belongsToCompany', 'company1');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
  });
});

describe('Project enrichment', () => {
  beforeEach(() => {
    jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue({
      isApplicationAdmin: false,
      isCompanyAdmin: false,
      userProjects: [
        { id: 'project3', role: 'admin' },
      ],
    });
  });

  test('Project company is set to null if not found in companyMap', async () => {
    mockRequest.query.set('whereCode', 'P003');

    const response = await getProjectsListHandler(
      mockRequest,
      mockContext,
      mockAuthService,
      mockProjectService
    );

    expect(response.status).toBeUndefined();
    expect(response.jsonBody).toHaveProperty('data');
    expect(response.jsonBody.data).toHaveLength(1);
    expect(response.jsonBody.data[0].company).toBeNull();
  });
});

// Important: this test must be the last one because Jest will mock the re
test('Handle internal server error', async () => {
  jest.spyOn(mockProjectService, 'getProjects').mockRejectedValue(new Error('Internal Error'));

  const response = await getProjectsListHandler(
    mockRequest,
    mockContext,
    mockAuthService,
    mockProjectService
  );

  expect(response.status).toBe(500);
  expect(response.jsonBody).toHaveProperty('message', 'Internal Server Error');
});

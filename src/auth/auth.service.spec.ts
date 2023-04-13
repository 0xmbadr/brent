import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';

const authRepoMock = {
  save: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: authRepoMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user and return it', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstname: 'taha',
        lastname: 'hussein',
      };
      const savedUser = {
        id: 1,
        email: userData.email,
        password: userData.password,
        firstname: userData.firstname,
        lastname: userData.lastname,
      };

      authRepoMock.save.mockResolvedValue(savedUser);
      const result = await authService.register(userData);

      expect(authRepoMock.save).toHaveBeenCalledWith(userData);
      expect(result).toEqual(savedUser);
    });
  });
});

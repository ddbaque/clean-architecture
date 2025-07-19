import { LoginUser } from '@/domain/use-cases/auth/login-user.use-case';
import { LoginUserDto } from '@/domain/dtos';
import { AuthRepository } from '@/domain/repositories';
import { CustomError } from '@/domain/errors';
import { User } from '@/domain/entities';

describe('LoginUser Use Case', () => {
  let loginUser: LoginUser;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockSignToken: jest.Mock;

  beforeEach(() => {
    // Mock del repository
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
    };

    // Mock de la función signToken
    mockSignToken = jest.fn();

    // Instancia del use case con dependencias mockeadas
    loginUser = new LoginUser(mockAuthRepository, mockSignToken);
  });

  describe('execute method', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange - Preparar datos
      const [, loginDto] = LoginUserDto.create({ email: 'john@example.com', password: 'Password123' });
      const mockUser = new User(1, 'John Doe', 'john@example.com', 'hashedPassword');
      const mockToken = 'jwt.token.here';

      mockAuthRepository.login.mockResolvedValue(mockUser);
      mockSignToken.mockResolvedValue(mockToken);

      // Act - Ejecutar el use case
      const result = await loginUser.execute(loginDto!);

      // Assert - Verificar resultado
      expect(mockAuthRepository.login).toHaveBeenCalledWith(loginDto);
      expect(mockSignToken).toHaveBeenCalledWith({ id: 1 }, '2d');

      expect(result).toEqual({
        token: mockToken,
        user: {
          id: 1,
          email: 'john@example.com',
          name: 'John Doe',
        },
      });
    });

    it('should throw error when token generation fails', async () => {
      // Arrange
      const [, loginDto] = LoginUserDto.create({ email: 'john@example.com', password: 'Password123' });
      const mockUser = new User(1, 'john@example.com', 'John Doe', 'hashedPassword');

      mockAuthRepository.login.mockResolvedValue(mockUser);
      mockSignToken.mockResolvedValue(null); // Token generation fails

      // Act & Assert
      await expect(loginUser.execute(loginDto!)).rejects.toThrow(CustomError);
      await expect(loginUser.execute(loginDto!)).rejects.toThrow('Internal Server Error');
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const [, loginDto] = LoginUserDto.create({ email: 'john@example.com', password: 'Password123' });
      const repositoryError = CustomError.unauthorized('Invalid credentials');

      mockAuthRepository.login.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(loginUser.execute(loginDto!)).rejects.toThrow(repositoryError);
      expect(mockSignToken).not.toHaveBeenCalled();
    });

    it('should call signToken with correct payload and duration', async () => {
      // Arrange
      const [, loginDto] = LoginUserDto.create({ email: 'jane@example.com', password: 'SecurePass456' });
      const mockUser = new User(42, 'jane@example.com', 'Jane Doe', 'hashedPassword');
      const mockToken = 'another.jwt.token';

      mockAuthRepository.login.mockResolvedValue(mockUser);
      mockSignToken.mockResolvedValue(mockToken);

      // Act
      await loginUser.execute(loginDto!);

      // Assert - Verificar que se llama con el payload correcto
      expect(mockSignToken).toHaveBeenCalledWith({ id: 42 }, '2d');
      expect(mockSignToken).toHaveBeenCalledTimes(1);
    });

    it('should return user without password in response', async () => {
      // Arrange
      const [, loginDto] = LoginUserDto.create({ email: 'test@example.com', password: 'TestPass789' });
      const mockUser = new User(5, 'Test User', 'test@example.com', 'supersecretpassword');
      const mockToken = 'secure.jwt.token';

      mockAuthRepository.login.mockResolvedValue(mockUser);
      mockSignToken.mockResolvedValue(mockToken);

      // Act
      const result = await loginUser.execute(loginDto!);

      // Assert - Verificar que la respuesta no incluye password
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).toEqual({
        id: 5,
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });
});

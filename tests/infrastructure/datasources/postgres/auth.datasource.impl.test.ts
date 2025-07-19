import { PostgresDatabase } from '@/data/postgres/postgres-database';
import { CustomError, LoginUserDto, RegisterUserDto } from '@/domain';
import { AuthDataSourceImpl } from '@/infrastructure/datasources/postgres/auth.datasource.impl';
import { UserMapper } from '@/infrastructure/mappers';

// Mock dependencies
jest.mock('@/data/postgres/postgres-database');
jest.mock('@/infrastructure/mappers');

describe('AuthDataSourceImpl', () => {
	let authDataSource: AuthDataSourceImpl;
	let mockHashPassword: jest.Mock;
	let mockComparePassword: jest.Mock;
	let mockPool: any;

	beforeEach(() => {
		// Mock de las funciones de password
		mockHashPassword = jest.fn();
		mockComparePassword = jest.fn();

		// Mock del pool de conexiones
		mockPool = {
			query: jest.fn(),
		};

		// Mock de PostgresDatabase
		(PostgresDatabase.getPool as jest.Mock) = jest.fn().mockReturnValue(mockPool);

		// Instancia del datasource
		authDataSource = new AuthDataSourceImpl(mockHashPassword, mockComparePassword);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('login method', () => {
		it('should login user successfully with valid credentials', async () => {
			// Arrange
			const [, loginDto] = LoginUserDto.create({
				email: 'john@example.com',
				password: 'Password123',
			});

			const mockUserFromDB = {
				id: 1,
				email: 'john@example.com',
				name: 'John Doe',
				password: 'hashedPassword123',
			};

			const mockUser = {
				id: 1,
				email: 'john@example.com',
				name: 'John Doe',
				password: 'hashedPassword123',
			};

			// Mock query response
			mockPool.query.mockResolvedValue({
				rows: [mockUserFromDB],
			});

			// Mock UserMapper
			(UserMapper.userEntityFromObject as jest.Mock).mockReturnValue(mockUser);

			// Mock password comparison
			mockComparePassword.mockReturnValue(true);

			// Act
			const result = await authDataSource.login(loginDto!);

			// Assert
			expect(PostgresDatabase.getPool).toHaveBeenCalled();
			expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM "user" WHERE email = $1', ['john@example.com']);
			expect(UserMapper.userEntityFromObject).toHaveBeenCalledWith(mockUserFromDB);
			expect(mockComparePassword).toHaveBeenCalledWith('Password123', 'hashedPassword123');
			expect(result).toEqual(mockUser);
		});

		it('should throw error when user is not found', async () => {
			// Arrange
			const [, loginDto] = LoginUserDto.create({
				email: 'nonexistent@example.com',
				password: 'Password123',
			});

			// Mock query response - no user found
			mockPool.query.mockResolvedValue({
				rows: [],
			});

			// Act & Assert
			await expect(authDataSource.login(loginDto!)).rejects.toThrow(CustomError);
			await expect(authDataSource.login(loginDto!)).rejects.toThrow('Problem with your credentials.');

			expect(mockComparePassword).not.toHaveBeenCalled();
			expect(UserMapper.userEntityFromObject).not.toHaveBeenCalled();
		});

		it('should throw error when password is incorrect', async () => {
			// Arrange
			const [, loginDto] = LoginUserDto.create({
				email: 'john@example.com',
				password: 'WrongPassword123',
			});

			const mockUserFromDB = {
				id: 1,
				email: 'john@example.com',
				name: 'John Doe',
				password: 'hashedPassword123',
			};

			const mockUser = {
				id: 1,
				email: 'john@example.com',
				name: 'John Doe',
				password: 'hashedPassword123',
			};

			// Mock query response
			mockPool.query.mockResolvedValue({
				rows: [mockUserFromDB],
			});

			// Mock UserMapper
			(UserMapper.userEntityFromObject as jest.Mock).mockReturnValue(mockUser);

			// Mock password comparison - returns false
			mockComparePassword.mockReturnValue(false);

			// Act & Assert
			await expect(authDataSource.login(loginDto!)).rejects.toThrow(CustomError);
			await expect(authDataSource.login(loginDto!)).rejects.toThrow('Problem with your credentials.');

			expect(mockComparePassword).toHaveBeenCalledWith('WrongPassword123', 'hashedPassword123');
		});

		it('should handle database query errors', async () => {
			// Arrange
			const [, loginDto] = LoginUserDto.create({
				email: 'john@example.com',
				password: 'Password123',
			});

			const dbError = new Error('Database connection failed');
			mockPool.query.mockRejectedValue(dbError);

			// Act & Assert
			await expect(authDataSource.login(loginDto!)).rejects.toThrow(dbError);

			expect(mockComparePassword).not.toHaveBeenCalled();
			expect(UserMapper.userEntityFromObject).not.toHaveBeenCalled();
		});
	});

	describe('register method', () => {
		it('should register user successfully', async () => {
			// Arrange
			const [, registerDto] = RegisterUserDto.create({
				name: 'John Doe',
				email: 'john@example.com',
				password: 'Password123',
			});

			const mockCreatedUser = {
				id: 1,
				email: 'john@example.com',
				name: 'John Doe',
				password: 'hashedPassword123',
			};

			const mockUser = {
				id: 1,
				email: 'john@example.com',
				name: 'John Doe',
				password: 'hashedPassword123',
			};

			// Mock query responses
			mockPool.query
				.mockResolvedValueOnce({ rows: [] }) // Email check - no existing user
				.mockResolvedValueOnce({ rows: [mockCreatedUser] }); // User creation

			// Mock password hashing
			mockHashPassword.mockReturnValue('hashedPassword123');

			// Mock UserMapper
			(UserMapper.userEntityFromObject as jest.Mock).mockReturnValue(mockUser);

			// Act
			const result = await authDataSource.register(registerDto!);

			// Assert
			expect(PostgresDatabase.getPool).toHaveBeenCalled();

			// Verify email check query
			expect(mockPool.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM "user" WHERE email = $1', ['john@example.com']);

			// Verify user creation query
			expect(mockPool.query).toHaveBeenNthCalledWith(
				2,
				'INSERT INTO "user" (email, name, password) VALUES ($1, $2, $3) RETURNING *;',
				['john@example.com', 'John Doe', 'hashedPassword123'],
			);

			expect(mockHashPassword).toHaveBeenCalledWith('Password123');
			expect(UserMapper.userEntityFromObject).toHaveBeenCalledWith(mockCreatedUser);
			expect(result).toEqual(mockUser);
		});

		it('should throw error when email already exists', async () => {
			// Arrange
			const [, registerDto] = RegisterUserDto.create({
				name: 'John Doe',
				email: 'existing@example.com',
				password: 'Password123',
			});

			const existingUser = {
				id: 1,
				email: 'existing@example.com',
				name: 'Existing User',
				password: 'hashedPassword',
			};

			// Mock query response - user already exists
			mockPool.query.mockResolvedValue({
				rows: [existingUser],
			});

			// Act & Assert
			await expect(authDataSource.register(registerDto!)).rejects.toThrow(CustomError);
			await expect(authDataSource.register(registerDto!)).rejects.toThrow('Problem with your credentials.');

			expect(mockHashPassword).not.toHaveBeenCalled();
			expect(UserMapper.userEntityFromObject).not.toHaveBeenCalled();
		});

		it('should handle database errors during email check', async () => {
			// Arrange
			const [, registerDto] = RegisterUserDto.create({
				name: 'John Doe',
				email: 'john@example.com',
				password: 'Password123',
			});

			const dbError = new Error('Database connection failed');
			mockPool.query.mockRejectedValue(dbError);

			// Act & Assert
			await expect(authDataSource.register(registerDto!)).rejects.toThrow(dbError);

			expect(mockHashPassword).not.toHaveBeenCalled();
			expect(UserMapper.userEntityFromObject).not.toHaveBeenCalled();
		});

		it('should handle database errors during user creation', async () => {
			// Arrange
			const [, registerDto] = RegisterUserDto.create({
				name: 'John Doe',
				email: 'john@example.com',
				password: 'Password123',
			});

			const dbError = new Error('Insert failed');

			// Mock query responses
			mockPool.query
				.mockResolvedValueOnce({ rows: [] }) // Email check - success
				.mockRejectedValueOnce(dbError); // User creation - fails

			mockHashPassword.mockReturnValue('hashedPassword123');

			// Act & Assert
			await expect(authDataSource.register(registerDto!)).rejects.toThrow(dbError);

			expect(mockHashPassword).toHaveBeenCalledWith('Password123');
			expect(UserMapper.userEntityFromObject).not.toHaveBeenCalled();
		});
	});
});

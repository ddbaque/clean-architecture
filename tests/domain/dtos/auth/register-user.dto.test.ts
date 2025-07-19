import { RegisterUserDto } from "@/domain";

describe('RegisterUserDto', () => {
  describe('create method', () => {
    it('should create dto with valid data', () => {
      // Arrange - Preparamos los datos de entrada
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      };

      // Act - Ejecutamos el método que queremos testear
      const [error, dto] = RegisterUserDto.create(validData);

      // Assert - Verificamos que el resultado sea el esperado
      expect(error).toBeUndefined();
      expect(dto).toBeDefined();
      expect(dto!.name).toBe('John Doe');
      expect(dto!.email).toBe('john@example.com');
      expect(dto!.password).toBe('Password123');
    });

    it('should throw error with invalid email format', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email', // Email inválido
        password: 'Password123',
      };

      // Act & Assert - Verificamos que lance una excepción
      expect(() => {
        RegisterUserDto.create(invalidData);
      }).toThrow('Invalid email format');
    });

    it('should throw error with weak password', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123', // Password muy corto
      };

      // Act & Assert
      expect(() => {
        RegisterUserDto.create(invalidData);
      }).toThrow('Password must be at least 8 characters');
    });

    it('should throw error with missing required fields', () => {
      // Arrange
      const invalidData = {
        name: '', // Nombre vacío
        email: 'john@example.com',
        password: 'Password123',
      };

      // Act & Assert
      expect(() => {
        RegisterUserDto.create(invalidData);
      }).toThrow('Name is required');
    });

    it('should throw error with invalid name characters', () => {
      // Arrange
      const invalidData = {
        name: 'John123', // Nombre con números
        email: 'john@example.com',
        password: 'Password123',
      };

      // Act & Assert
      expect(() => {
        RegisterUserDto.create(invalidData);
      }).toThrow('Name can only contain letters and spaces');
    });

    it('should throw error with password missing uppercase', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123', // Sin mayúscula
      };

      // Act & Assert
      expect(() => {
        RegisterUserDto.create(invalidData);
      }).toThrow('Password must contain at least one lowercase, one uppercase and one number');
    });
  });
});

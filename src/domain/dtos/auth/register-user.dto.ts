export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) { }

  static create(object: { [key: string]: any }): [string | undefined, RegisterUserDto?] {
    const { name, email, password } = object;

    if (typeof name !== 'string') return ['Name must be a string'];
    if (!name.trim()) return ['Missing name'];

    if (typeof email !== 'string') return ['Email must be a string'];
    if (!email.trim()) return ['Missing email'];

    if (typeof password !== 'string') return ['Password must be a string'];
    if (!password.trim()) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters long'];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}

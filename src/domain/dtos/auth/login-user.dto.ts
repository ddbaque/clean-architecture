export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string,
  ) { }

  static create(object: { [key: string]: any }): [string | undefined, LoginUserDto?] {
    const { email, password } = object;

    if (typeof email !== 'string') return ['Email must be a string'];
    if (!email.trim()) return ['Missing email'];

    if (typeof password !== 'string') return ['Password must be a string'];
    if (!password.trim()) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters long'];

    return [undefined, new LoginUserDto(email, password)];
  }
}

export class GetUserDto {
	private constructor(public id: number) {}

	static create(object: { [key: string]: any }): [string | undefined, GetUserDto?] {
		const { id } = object;

		if (typeof id !== 'number') return ['Id must be a number'];

		return [undefined, new GetUserDto(id)];
	}
}

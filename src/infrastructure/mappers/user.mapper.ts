import { CustomError, User } from '@/domain';

export class UserMapper {
	static userEntityFromObject(object: { [key: string]: any }) {
		const { id, _id, name, email, password } = object;

		if (!_id && !id) {
			console.log('from object', object);
			throw CustomError.badRequest('Missing id');
		}

		if (!name) throw CustomError.badRequest('Missing name');
		if (!email) throw CustomError.badRequest('Missing email');
		if (!password) throw CustomError.badRequest('Missing password');

		return new User(_id || id, name, email, password);
	}

	static userArrayEntityFromObject(data: { [key: string]: any }[]) {
		return data.map((user) => this.userEntityFromObject(user));
	}
}

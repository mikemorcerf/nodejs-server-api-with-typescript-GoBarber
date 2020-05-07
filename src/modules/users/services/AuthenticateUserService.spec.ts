import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
	it('should be able to authenticate an existing user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		const authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		const newUser = await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const response = await authenticateUser.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(newUser);
	});

	it('should not be able to authenticate an user that does not exist', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		expect(
			authenticateUser.execute({
				email: 'idontexist@ghost.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate an user who has provided the wrong password', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		const authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(
			authenticateUser.execute({
				email: 'johndoe@example.com',
				password: '654321',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

		authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});

	it('should be able to authenticate an existing user', async () => {
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
		await expect(
			authenticateUser.execute({
				email: 'idontexist@ghost.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate an user who has provided the wrong password', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await expect(
			authenticateUser.execute({
				email: 'johndoe@example.com',
				password: '654321',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});

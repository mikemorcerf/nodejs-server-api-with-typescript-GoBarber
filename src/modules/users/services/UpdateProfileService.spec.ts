// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		updateProfile = new UpdateProfileService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});

	it('should be able to update profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'John Smith',
			email: 'johnsmith@example.com',
		});

		expect(updatedUser.name).toBe('John Smith');
		expect(updatedUser.email).toBe('johnsmith@example.com');
	});

	it('should not be able to update email to one that is already being used by another user', async () => {
		await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const user = await fakeUsersRepository.create({
			name: 'John Doe Smith',
			email: 'johnsmith@example.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Smith',
				email: 'johndoe@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'John Doe',
			email: 'johndoe@example.com',
			old_password: '123456',
			password: '654321',
		});

		expect(updatedUser.password).toBe('654321');
	});

	it('should not be able to update the password without old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: '654321',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the password given a wrong old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'johndoe@example.com',
				old_password: 'wrong-old-password',
				password: '654321',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update profile of a non-existing user', async () => {
		await expect(
			updateProfile.execute({
				user_id: 'non-existing-user-id',
				name: 'John Smith',
				email: 'johnsmith@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 10).getTime();
		});

		const appointment = await createAppointment.execute({
			date: new Date(2020, 4, 10, 12),
			provider_id: '123456789',
			user_id: 'customer_id',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('123456789');
	});

	it('should not be able to create two appointments on the same time', async () => {
		jest.spyOn(Date, 'now').mockImplementation(() => {
			return new Date(2020, 4, 10, 10).getTime();
		});

		const appointmentDate = new Date(2020, 4, 11, 12);

		await createAppointment.execute({
			date: appointmentDate,
			provider_id: '123456789',
			user_id: 'customer_id',
		});

		await expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: '123456789',
				user_id: 'customer_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment at a past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 11),
				provider_id: '123456789',
				user_id: 'customer_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment where customer_id is the same as provider_id', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 10).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 11),
				provider_id: 'customer_id',
				user_id: 'customer_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment before 8am or after 5pm', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 10).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 7),
				provider_id: 'provider_id',
				user_id: 'customer_id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 18, 7),
				provider_id: 'provider_id',
				user_id: 'customer_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});

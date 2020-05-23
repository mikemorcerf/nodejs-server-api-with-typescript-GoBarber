import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	date: Date;
	provider_id: string;
	user_id: string;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,

		@inject('NotificationsRepository')
		private notificationsRepository: INotificationsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({
		date,
		provider_id,
		user_id,
	}: IRequest): Promise<Appointment> {
		if (user_id === provider_id) {
			throw new AppError('You cannot create an appointment with yourself');
		}

		const appointmentDate = startOfHour(date);

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError('Cannot create appointments before 8am or past 5pm');
		}

		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError(
				'Appointments at a time past the current time cannot be created',
			);
		}

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
			provider_id,
		);

		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const appointment = await this.appointmentsRepository.create({
			provider_id,
			date: appointmentDate,
			user_id,
		});

		const formattedDate = format(appointmentDate, "MMMM Mo 'at' HH:mm'h'");

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `New appointment scheduled for ${formattedDate}`,
		});

		this.cacheProvider.invalidate(
			`provider-appointments:${provider_id}:${format(
				appointmentDate,
				'yyyy-M-d',
			)}`,
		);

		return appointment;
	}
}

export default CreateAppointmentService;

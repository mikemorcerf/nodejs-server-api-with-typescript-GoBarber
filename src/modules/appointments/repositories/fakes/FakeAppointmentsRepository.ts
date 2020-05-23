import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findByDate(
		date: Date,
		provider_id: string,
	): Promise<Appointment | undefined> {
		const findAppointment = this.appointments.find(
			appointment =>
				isEqual(appointment.date, date) &&
				appointment.provider_id === provider_id,
		);

		return findAppointment;
	}

	public async findAllInMonthFromProvider({
		provider_id,
		month,
		year,
	}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
		const appointmentsInMonthFromProvider = this.appointments.filter(
			appointment => {
				return (
					appointment.provider_id === provider_id &&
					getMonth(appointment.date) + 1 === month &&
					getYear(appointment.date) === year
				);
			},
		);

		return appointmentsInMonthFromProvider;
	}

	public async findAllInDayFromProvider({
		provider_id,
		day,
		month,
		year,
	}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
		const appointmentsInDayFromProvider = this.appointments.filter(
			appointment => {
				return (
					appointment.provider_id === provider_id &&
					getMonth(appointment.date) + 1 === month &&
					getYear(appointment.date) === year &&
					getDate(appointment.date) === day
				);
			},
		);

		return appointmentsInDayFromProvider;
	}

	public async create({
		provider_id,
		date,
		user_id,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

		this.appointments.push(appointment);

		return appointment;
	}
}

export default AppointmentsRepository;

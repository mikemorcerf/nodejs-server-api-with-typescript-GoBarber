import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	month: number;
	year: number;
}

type IResponse = Array<{
	day: number;
	available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({
		provider_id,
		year,
		month,
	}: IRequest): Promise<IResponse> {
		const appointmentsInMonthFromProvider = await this.appointmentsRepository.findAllInMonthFromProvider(
			{
				provider_id,
				year,
				month,
			},
		);

		const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

		const eachDayArray = Array.from(
			{ length: numberOfDaysInMonth },
			(_, index) => index + 1,
		);

		const currentDate = new Date(Date.now());

		const availabilityOfDaysInMonth = eachDayArray.map(day => {
			const appointmentsInDay = appointmentsInMonthFromProvider.filter(
				appointment => {
					return getDate(appointment.date) === day;
				},
			);

			const compareDate = new Date(year, month - 1, day, 17, 1, 0);

			return {
				day,
				available:
					appointmentsInDay.length < 10 && isAfter(compareDate, currentDate),
			};
		});

		return availabilityOfDaysInMonth;
	}
}

export default ListProviderMonthAvailabilityService;

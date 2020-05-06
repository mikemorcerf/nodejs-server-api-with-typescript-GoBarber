import { Router } from 'express';
import { container } from 'tsyringe';

import AuthentitateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

// Getting routes starting with '/sessions'

// post('/')
sessionsRouter.post('/', async (request, response) => {
	const { email, password } = request.body;

	const authenticateUser = container.resolve(AuthentitateUserService);

	const { user, token } = await authenticateUser.execute({
		email,
		password,
	});

	delete user.password;

	return response.json({ user, token });
});

export default sessionsRouter;

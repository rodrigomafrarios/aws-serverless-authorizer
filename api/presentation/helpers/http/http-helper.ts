import { ServerError } from '@/presentation/errors/server-error'
import { HttpResponse } from '@/presentation/interfaces/http'

export const badRequest = (error: Error): HttpResponse => {
	return {
		statusCode: 400,
		body: error
	}
}

export const serverError = (error: Error): HttpResponse => {
	return {
		statusCode: 500,
		body: new ServerError(error.stack)
	}
}

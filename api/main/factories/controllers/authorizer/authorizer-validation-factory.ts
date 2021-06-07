import { ValidationComposite, RequiredFieldValidation } from '@/presentation/helpers/validators'
import { Validation } from '@/presentation/interfaces/validation'

export const makeAuthorizerValidation = (): ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['accessToken','methodArn']) {
		validations.push(new RequiredFieldValidation(field))
	}
	return new ValidationComposite(validations)
}

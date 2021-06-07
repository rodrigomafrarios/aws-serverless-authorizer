import { AuthorizerController } from '@/presentation/controllers/authorizer/authorizer-controller'
import { makeAWSAuthorizer } from '@/main/factories/usecases/authorizer/aws-authorizer-factory'
import { makeAuthorizerValidation } from './authorizer-validation-factory'

export const makeAuthorizerController = () => {
  const controller = new AuthorizerController(makeAuthorizerValidation(), makeAWSAuthorizer())
  return controller
}

import 'module-alias/register'
import 'source-map-support/register'
import { middyfy } from '@/libs/lambda'

import { makeAuthorizerController } from '@/main/factories/controllers/authorizer/authorizer-controller-factory'
import { HttpRequest } from '@/presentation/interfaces/http'

const authorizer = async (event: any) => {
  const controller = makeAuthorizerController()
  const httpRequest: HttpRequest = {
    body: {
      accessToken: event.authorizationToken,
      methodArn: event.methodArn
    }
  }
  const policy = await controller.handle(httpRequest)
  return policy
}

export const handler = middyfy(authorizer)

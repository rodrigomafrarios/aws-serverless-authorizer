import { PolicyGeneratorResponse } from '@/data/interfaces/aws/policy-generator'
import { Authorizer } from '@/domain/usecases/authorizer/authorizer'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'
import { Validation } from '@/presentation/interfaces/validation'

export class AuthorizerController {
  constructor (
    private readonly validator: Validation,
    private readonly authorizer: Authorizer
  ) {}

  async handle (httpRequest: HttpRequest): Promise<PolicyGeneratorResponse | HttpResponse> {
    try {
      const { body } = httpRequest
      const error = await this.validator.validate(body)
      if (error) {
        return badRequest(error)
      }
      const policy = await this.authorizer.auth(body)
      return policy
    } catch (error) {
      return serverError(error)
    }
  }
}

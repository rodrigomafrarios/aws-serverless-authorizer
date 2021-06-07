import { AuthorizerController } from '@/presentation/controllers/authorizer/authorizer-controller'
import { Validation } from '@/presentation/interfaces/validation'
import { makeValidation } from '@/tests/presentation/mocks/validation-mocks'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { Authorizer, AuthorizerParams } from '@/domain/usecases/authorizer/authorizer'
import { PolicyGeneratorResponse } from '@/data/interfaces/aws/policy-generator'
import { mockAllowPolicy } from '@/tests/infra/mocks/aws-policy-generator-mocks'

type SutTypes = {
  sut: AuthorizerController
  validationStub: Validation
  authorizerStub: Authorizer
}

const makeRequest = () => ({
  body: {
    accessToken: 'any_token',
    methodArn: 'any_method_arn'
  }
})

const makeAuthorizer = () => {
  class AuthorizerStub implements Authorizer {
    auth (params: AuthorizerParams): Promise<PolicyGeneratorResponse> {
      return Promise.resolve(mockAllowPolicy())
    }
  }

  return new AuthorizerStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authorizerStub = makeAuthorizer()
  const sut = new AuthorizerController(validationStub, authorizerStub)
  return {
    sut,
    validationStub,
    authorizerStub
  }
}

describe('AuthorizerController', () => {
  test('Should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeRequest())
    expect(validationSpy).toHaveBeenCalledWith({
      accessToken: 'any_token',
      methodArn: 'any_method_arn'
    })
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call Authorizer with correct accessToken', async () => {
    const { sut, authorizerStub } = makeSut()
    const authorizerSpy = jest.spyOn(authorizerStub, 'auth')
    await sut.handle(makeRequest())
    expect(authorizerSpy).toHaveBeenCalledWith({
      accessToken: 'any_token',
      methodArn: 'any_method_arn'
    })
  })

  test('Should throw if Authorizer throws', async () => {
    const { sut, authorizerStub } = makeSut()
    jest.spyOn(authorizerStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(mockAllowPolicy())
  })
})

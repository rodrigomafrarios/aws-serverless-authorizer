import { PolicyGenerator, PolicyGeneratorParams, PolicyGeneratorResponse } from '@/data/interfaces/aws/policy-generator'
import { Decrypter } from '@/data/interfaces/criptography/decrypter'
import { AWSAuthorizer } from '@/data/usecases/authorizer/aws-authorizer'
import { AuthorizerParams } from '@/domain/usecases/authorizer/authorizer'
import { mockAllowPolicyParams, mockDenyPolicyParams } from '@/tests/infra/mocks/aws-policy-generator-mocks'

type SutTypes = {
  sut: AWSAuthorizer
  decrypterStub: Decrypter
  policyGeneratorStub: PolicyGenerator
}

const mockDecrypter = (): Decrypter => {
	class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
        return Promise.resolve('any_value')
    }
	}
	return new DecrypterStub()
}

const mockPolicyGenerator = (): PolicyGenerator => {
  class PolicyGeneratorStub implements PolicyGenerator {
    async generate (params: PolicyGeneratorParams): Promise<PolicyGeneratorResponse> {
      return Promise.resolve(undefined)
    }
  }

  return new PolicyGeneratorStub()
}

const mockAuthorizerParams = (): AuthorizerParams => {
  return {
    accessToken: 'any_token',
    methodArn: 'any_method_arn'
  }
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const policyGeneratorStub = mockPolicyGenerator()
  const sut = new AWSAuthorizer(decrypterStub, policyGeneratorStub)
  return {
    sut,
    decrypterStub,
    policyGeneratorStub
  }
}

describe('DbAuthorizer - Usecase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.auth(mockAuthorizerParams())
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should call PolicyGenerator denying access on Decrypter fail', async () => {
    const { sut, decrypterStub, policyGeneratorStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const policyGeneratorSpy = jest.spyOn(policyGeneratorStub, 'generate')
    await sut.auth(mockAuthorizerParams())
    expect(policyGeneratorSpy).toHaveBeenCalledWith(mockDenyPolicyParams())
  })

  test('Should call PolicyGenerator granting access on Decrypter success', async () => {
    const { sut, decrypterStub, policyGeneratorStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve('any_decrypted_user'))
    const policyGeneratorSpy = jest.spyOn(policyGeneratorStub, 'generate')
    await sut.auth(mockAuthorizerParams())
    expect(policyGeneratorSpy).toHaveBeenCalledWith(mockAllowPolicyParams())
  })  
})

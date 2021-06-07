import { AWSPolicyGenerator } from '@/infra/aws/policy-generator'
import { mockAllowPolicy, mockAllowPolicyParams, mockDenyPolicy, mockDenyPolicyParams } from '@/tests/infra/mocks/aws-policy-generator-mocks'

const makeSut = (): AWSPolicyGenerator => {
  return new AWSPolicyGenerator()
}

describe('AWSPolicyGenerator', () => {
  test('Should generate aws policy to grant invoke lambda', async () => {
    const sut = makeSut()
    const params = mockAllowPolicyParams()
    const policy = await sut.generate(params)
    expect(policy).toEqual(mockAllowPolicy())
  })

  test('Should generate aws policy without resource', async () => {
    const sut = makeSut()
    const params = mockAllowPolicyParams()
    delete params.resource
    const policy = await sut.generate(params)
    expect(policy).toEqual({
      principalId: params.principalId
    })
  })

  test('Should generate aws policy without effect', async () => {
    const sut = makeSut()
    const params = mockAllowPolicyParams()
    delete params.effect
    const policy = await sut.generate(params)
    expect(policy).toEqual({
      principalId: params.principalId
    })
  })

  test('Should generate aws policy to deny invoke lambda', async () => {
    const sut = makeSut()
    const params = mockDenyPolicyParams()
    const policy = await sut.generate(params)
    expect(policy).toEqual(mockDenyPolicy())
  })
})

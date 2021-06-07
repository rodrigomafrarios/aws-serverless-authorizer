import { PolicyGenerator, PolicyGeneratorParams, PolicyGeneratorResponse } from '@/data/interfaces/aws/policy-generator'
import { Decrypter } from '@/data/interfaces/criptography/decrypter'
import { Authorizer, AuthorizerParams } from '@/domain/usecases/authorizer/authorizer'

export class AWSAuthorizer implements Authorizer {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly policyGenerator: PolicyGenerator
  ) {}

  async auth (params: AuthorizerParams): Promise<PolicyGeneratorResponse> {
    const { accessToken, methodArn } = params
    const decryptedUser = await this.decrypter.decrypt(accessToken)

    const policyGeneratorParams: PolicyGeneratorParams = {
      principalId: 'user',
      effect: 'Deny',
      resource: methodArn,
      decryptedUser: ''
    }

    if (decryptedUser) {
      policyGeneratorParams.effect = 'Allow'
      policyGeneratorParams.decryptedUser = decryptedUser
    }

    const policy = await this.policyGenerator.generate(policyGeneratorParams)

    return policy
  }
}

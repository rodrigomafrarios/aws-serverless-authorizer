import { PolicyGenerator, PolicyGeneratorParams, PolicyGeneratorResponse } from '@/data/interfaces/aws/policy-generator'
import { PolicyDocument } from 'aws-lambda/trigger/api-gateway-authorizer'

export class AWSPolicyGenerator implements PolicyGenerator {
  async generate (params: PolicyGeneratorParams): Promise<PolicyGeneratorResponse> {
    const policy: PolicyGeneratorResponse = {
      principalId: params.principalId
    }
    const hasEffectAndResource = (params.effect && params.resource)

    if (hasEffectAndResource) {
      const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: []
      }
      policyDocument.Statement.push({
        Action: 'execute-api:Invoke',
        Effect: params.effect,
        Resource: params.resource
      })
      policy.policyDocument = policyDocument
    }
    return policy
  }
}

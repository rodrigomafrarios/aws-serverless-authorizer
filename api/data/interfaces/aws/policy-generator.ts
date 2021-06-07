import { PolicyDocument } from 'aws-lambda/trigger/api-gateway-authorizer'

export interface PolicyGeneratorParams {
  principalId: string
  effect: string
  resource: string
  decryptedUser: object | string
}

export interface PolicyGeneratorResponse {
  principalId: string
  policyDocument?: PolicyDocument
  context?: string
}

export interface PolicyGenerator {
  generate: (params: PolicyGeneratorParams) => Promise<PolicyGeneratorResponse>
}

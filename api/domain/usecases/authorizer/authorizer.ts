import { PolicyGeneratorResponse } from '@/data/interfaces/aws/policy-generator'

export type AuthorizerParams = {
  accessToken: string
  methodArn: string
}

export interface Authorizer {
  auth: (params: AuthorizerParams) => Promise<PolicyGeneratorResponse>
}

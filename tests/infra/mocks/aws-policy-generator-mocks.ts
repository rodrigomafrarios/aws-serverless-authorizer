import { PolicyGeneratorParams } from "@/data/interfaces/aws/policy-generator"

export const mockDenyPolicyParams = (): PolicyGeneratorParams => {
  return {
    principalId: 'user',
    effect: 'Deny',
    resource: 'any_method_arn',
    decryptedUser: ''
  }
}

export const mockDenyPolicy = () => {
  const params = mockDenyPolicyParams()
  return {
    principalId: params.principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: params.effect,
        Resource: params.resource
      }]
    }
  }
}

export const mockAllowPolicyParams = (): PolicyGeneratorParams => {
  return {
    principalId: 'user',
    effect: 'Allow',
    resource: 'any_method_arn',
    decryptedUser: 'any_decrypted_user'
  }
}

export const mockAllowPolicy = () => {
  const params = mockAllowPolicyParams()
  return {
    principalId: params.principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: params.effect,
        Resource: params.resource
      }]
    }
  }
}
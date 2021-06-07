import { AWSAuthorizer } from '@/data/usecases/authorizer/aws-authorizer'
import { Authorizer } from '@/domain/usecases/authorizer/authorizer'
import { AWSPolicyGenerator } from '@/infra/aws/policy-generator'
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter'

export const makeAWSAuthorizer = (): Authorizer => {
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET)
  const policyGenerator = new AWSPolicyGenerator()
  return new AWSAuthorizer(jwtAdapter, policyGenerator)
}

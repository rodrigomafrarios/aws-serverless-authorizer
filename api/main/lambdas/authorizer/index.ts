import { handlerPath } from '@/libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/main.handler`,
  environment: {
    JWT_SECRET: '${ssm:${self:custom.stage}-jwt-secret}'
  },
  events: [
    {
      http: {
        method: 'get',
        path: 'authorizer'
      }
    }
  ]
}

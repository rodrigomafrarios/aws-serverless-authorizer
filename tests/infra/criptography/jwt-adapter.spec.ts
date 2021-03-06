import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter'

jest.mock('jsonwebtoken', () => ({
	async sign (): Promise<string> {
		return Promise.resolve('any_token')
	},
	async verify (token: string): Promise<string> {
		return Promise.resolve('any_value')
	}
}))

const makeSut = (): JwtAdapter => {
	return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
	describe('verify()', () => {
		test('Should call verify with correct values', async () => {
			const sut = makeSut()
			const verifySpy = jest.spyOn(jwt, 'verify')
			await sut.decrypt('any_token')
			expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
		})
		test('Should return a value on verify success', async () => {
			const sut = makeSut()
			const value = await sut.decrypt('any_token')
			expect(value).toBe('any_value')
		})
		test('Should throw if verify throws', async () => {
			const sut = makeSut()
			jest.spyOn(jwt, 'verify').mockRejectedValueOnce(new Error())
			const promise = sut.decrypt('any_token')
			await expect(promise).rejects.toThrow()
		})
	})
})

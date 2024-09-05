import { cleanDb, createServer, start } from '@/utils'
import { Express } from 'express'
import { IncomingMessage, Server, ServerResponse } from 'http'
import pactum from 'pactum'

describe('App e2e', () => {
    let app: Express
    let server: Server<typeof IncomingMessage, typeof ServerResponse>

    beforeAll(async () => {
        pactum.request.setBaseUrl('http://localhost:3003/api')
        app = createServer()

        server = await start(app)
    })

    afterAll(async () => {
        // Clean the db

        await cleanDb()

        server.close()
    })

    describe('User', () => {
        describe('Register', () => {
            it('should register a new user and add a refresh token to cookies', () => {
                return pactum
                    .spec()
                    .post('/register')
                    .withBody({
                        email: 'sevcenkoivan673@gmail.com',
                        password: '12345678',
                    })
                    .expectStatus(201)
                    .expectCookiesLike('refreshToken', /.*/)
            })

            it('should not register a user when no body provided', () => {
                return pactum.spec().post('/register').expectStatus(400)
            })

            it('should not register a user when email is invalid', () => {
                return pactum.spec().post('/register').withBody({
                    email: 'test',
                    password: '12345678',
                })
            })

            it('should not register a user when password is invalid', () => {
                return pactum.spec().post('/register').withBody({
                    email: '0iXZj@example.com',
                    password: '1234',
                })
            })
        })
    })
})

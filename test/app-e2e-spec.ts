import pactum from 'pactum'
import server from '../src/main'

describe('App e2e', () => {
    beforeAll(() => {
        pactum.request.setBaseUrl('http://localhost:3003/api')
    })

    afterAll(() => {
        server.close()
    })

    describe('User', () => {
        it('should create a new user', () => {
            return pactum
                .spec()
                .post('/register')
                .withBody({
                    email: 'jXJp0@example.com',
                    password: '12345678',
                })
                .expectStatus(201)
        })
    })
})

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticadeUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticadeUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '62981719850',
        latitude: -16.6786651,
        longitude: -49.2563992,
      })

    expect(response.statusCode).toEqual(201)
  })
})

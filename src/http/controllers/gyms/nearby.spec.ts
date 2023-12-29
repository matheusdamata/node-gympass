import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticadeUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticadeUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '62981719850',
        latitude: -16.6926552,
        longitude: -49.2942842,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '62981719850',
        latitude: -16.749244,
        longitude: -49.3753187,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -16.749244,
        longitude: -49.3753187,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TypeScript Gym',
      }),
    ])
  })
})

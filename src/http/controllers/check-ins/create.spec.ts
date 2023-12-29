import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticadeUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticadeUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -16.6786651,
        longitude: -49.2563992,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -16.6786651,
        longitude: -49.2563992,
      })

    expect(response.statusCode).toEqual(201)
  })
})

import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'

const app = new Hono()

app.get('/', (c) => {
  return c.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the current leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns the teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents'
    },
    {
      endpoint: '/presidents/:id',
      description: 'Returns a single president'
    }
  ])
})

app.get('/leaderboard', (c) => c.json(leaderboard))

app.get('/teams', (c) => c.json(teams))

app.get('/presidents', (c) => c.json(presidents))
app.get('/presidents/:id', (c) => {
  const id = c.req.param('id')
  const foundPresident = presidents.find((p) => p.id === id)

  return foundPresident
    ? c.json(foundPresident)
    : c.json({ error: 'President not found' }, 404)
})

app.get('/static/*', serveStatic({ root: './' }))

export default app

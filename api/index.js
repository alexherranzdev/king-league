import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'

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
    }
  ])
})

app.get('/leaderboard', (c) => c.json(leaderboard))
app.get('/teams', (c) => c.json(teams))

app.get('/static/*', serveStatic({ root: './' }))

export default app

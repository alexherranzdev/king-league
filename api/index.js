import { Hono } from 'hono'
import leaderboard from '../db/leaderboard.json'

const app = new Hono()

app.get('/', (c) => {
  return c.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the current leaderboard'
    }
  ])
})

app.get('/leaderboard', (c) => {
  return c.json(leaderboard)
})

export default app

// export default {
//   async fetch(request, env, ctx) {
//     return new Response(JSON.stringify(leaderboard), {
//       headers: { 'content-type': 'application/json;charset=UTF-8' }
//     })
//   }
// }

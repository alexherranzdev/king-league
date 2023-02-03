import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'
import coaches from '../db/coaches.json'
import topScorer from '../db/top_scorer.json'
import mvp from '../db/mvp.json'
import assists from '../db/assists.json'

const app = new Hono()

app.get('/', (ctx) =>
  ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns Kings League leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns Kings League teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns Kings League presidents'
    },
    {
      endpoint: '/coaches',
      description: 'Returns Kings League coaches'
    },
    {
			endpoint: '/assists',
			description: 'Returns Kings League assists'
		},
    {
			endpoint: '/top-scorer',
			description: 'Returns Kings League top scorer'
		},
    {
			endpoint: '/mvp',
			description: 'Returns Kings League MVP'
		},
    {
			endpoint: '/assists',
			description: 'Returns Kings League assists'
		}
  ])
)

app.get('/leaderboard', (ctx) => {
	return ctx.json(leaderboard)
})


app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/coaches', (ctx) => {
  return ctx.json(coaches)
})

app.get('/top-scorer', (ctx) => {
  return ctx.json(topScorer)
})

app.get('/mvp', (ctx) => {
  return ctx.json(mvp)
})

app.get('/assists', (ctx) => {
  return ctx.json(assists)
})

app.get('/presidents/:id', (ctx) => {
	const id = ctx.req.param('id')
	const foundPresident = presidents.find((president) => president.id === id)

	return foundPresident
		? ctx.json(foundPresident)
		: ctx.json({ message: 'President not found' }, 404)
})

app.get('/teams/:id', (ctx) => {
	const id = ctx.req.param('id')
	const foundTeam = teams.find((team) => team.id === id)

	return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((c) => {
	const { pathname } = new URL(c.req.url)

	if (c.req.url.at(-1) === '/') {
		return c.redirect(pathname.slice(0, -1))
	}

	return c.json({ message: 'Not Found' }, 404)
})

export default app
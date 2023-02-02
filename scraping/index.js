import { writeFile } from 'node:fs/promises'
import { scrape, readDBFile, cleanText } from '../utils/index.js'
import { DB_PATH } from '../utils/constants.js'

const TEAMS = await readDBFile('teams')

const URLS = {
  LEADERBOARD: 'https://www.kingsleague.pro/estadisticas/clasificacion'
}
async function getLeaderboard() {
  const $ = await scrape(URLS.LEADERBOARD)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    victories: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
    goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const getTeamFromName = ({ name }) => TEAMS.find((team) => team.name === name)

  let leaderboard = []

  $rows.each((_, el) => {
    const $el = $(el)

    const leaderBoardEntries = Object.entries(LEADERBOARD_SELECTORS).map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text()
        const cleanedValue = cleanText(rawValue)

        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue

        return [key, value]
      }
    )

    const { team: teamName, ...leaderBoardForTeam } =
      Object.fromEntries(leaderBoardEntries)

    const team = getTeamFromName({ name: teamName })

    leaderboard.push({ ...leaderBoardForTeam, team })
  })

  return leaderboard
}

const leaderboard = await getLeaderboard()

await writeFile(
  `${DB_PATH}/leaderboard.json`,
  JSON.stringify(leaderboard, null, 2),
  'utf-8'
)

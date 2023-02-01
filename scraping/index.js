import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const URLS = {
  LEADERBOARD: 'https://www.kingsleague.pro/estadisticas/clasificacion'
}

async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()

  return cheerio.load(html)
}

async function getLeaderboard() {
  const $ = await scrape(URLS.LEADERBOARD)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    TEAM: { selector: '.fs-table-text_3', typeOf: 'string' },
    VICTORIES: { selector: '.fs-table-text_4', typeOf: 'number' },
    LOSES: { selector: '.fs-table-text_5', typeOf: 'number' },
    GOALS_SCORED: { selector: '.fs-table-text_6', typeOf: 'number' },
    GOALS_CONCEDED: { selector: '.fs-table-text_7', typeOf: 'number' },
    YELLOW_CARDS: { selector: '.fs-table-text_8', typeOf: 'number' },
    RED_CARDS: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const cleanText = (text) =>
    text
      .replace(/\t|\n|\s:/g, ' ')
      .replace('/.*:/g')
      .trim()

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

    leaderboard.push(Object.fromEntries(leaderBoardEntries))
  })

  return leaderboard
}

const leaderboard = await getLeaderboard()

const filePath = path.join(process.cwd(), 'db', 'leaderboard.json')
await writeFile(filePath, JSON.stringify(leaderboard, null, 2), 'utf-8')

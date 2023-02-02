import * as cheerio from 'cheerio'
import { readFile, writeFile } from 'node:fs/promises'
import { DB_PATH } from '../utils/constants.js'

export async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()

  return cheerio.load(html)
}

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, ' ')
    .replace('/.*:/g')
    .trim()

export function readDBFile(dbName) {
  return readFile(`${DB_PATH}/${dbName}.json`, 'utf8').then(JSON.parse)
}

export function writeDBFile(dbName, data) {
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

export const TEAMS = await readDBFile('teams')
export const PRESIDENTS = await readDBFile('presidents')

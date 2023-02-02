import * as cheerio from 'cheerio'

import { readFile } from 'node:fs/promises'
import { DB_PATH } from '../utils/constants.js'

export async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()

  return cheerio.load(html)
}

export function readDBFile(dbName) {
  return readFile(`${DB_PATH}/${dbName}.json`, 'utf8').then(JSON.parse)
}

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, ' ')
    .replace('/.*:/g')
    .trim()

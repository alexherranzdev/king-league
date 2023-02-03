import { readFile, writeFile } from 'node:fs/promises'
import { DB_PATH } from '../utils/constants.js'

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

export function getImageFromTeam({ name }) {
	const { image } = TEAMS.find((team) => team.name === name)
	return image
}

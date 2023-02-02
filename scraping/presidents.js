import { scrape, readDBFile, cleanText } from '../utils/index.js'
import { DB_PATH, STATICS_PATH } from '../utils/constants.js'
import { writeFile } from 'node:fs/promises'

const TEAMS = await readDBFile('teams')

const presidents = await Promise.all(
  TEAMS.map(async (team) => {
    const { url, presidentId: id, id: teamId } = team

    const $ = await scrape(url)

    const $president = $('#teamSliders ul li:first-child')
    const imageUrl = $president.find('.el-image').attr('src')
    const name = cleanText($president.find('.el-title').text())

    const fileExtension = imageUrl.split('.').at(-1).toLocaleLowerCase()

    const responseImage = await fetch(imageUrl)
    const arrayBuffer = await responseImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const imageFileName = `${id}.${fileExtension}`
    await writeFile(`${STATICS_PATH}/presidents/${imageFileName}`, buffer)

    return { id, name, image: imageFileName, team: teamId }
  })
)

await writeFile(
  `${DB_PATH}/presidents.json`,
  JSON.stringify(presidents, null, 2)
)

import { readFile } from 'node:fs/promises'

export async function getAbi (contract) {
  const file = await readFile(new URL(`./_fixtures/${contract}.json`, import.meta.url))
  return JSON.parse(file)
}

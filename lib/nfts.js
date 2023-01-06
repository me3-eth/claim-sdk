import { MissingMetadata, NoTokensAvailable, TooManyRequests } from './errors.js'

export async function nfts (tokenAddress, walletAddress, opts = {}) {
  if (!opts.alchemyApi || !opts.alchemyApi.key) {
    throw new Error('Missing Alchemy API key')
  }
  const apiKey = opts.alchemyApi.key
  const apiEnv = opts.alchemyApi.env || 'mainnet'

  const options = { mode: 'cors', redirect: 'follow', method: 'GET' }

  let owned = []
  const url = new URL(`https://eth-${apiEnv}.alchemyapi.io/v2/${apiKey}/getNFTs`)
  const searchParams = { owner: walletAddress }
  Object.keys(searchParams).forEach(key => url.searchParams.append(key, searchParams[key]))

  const response = await fetch(url, { ...options })
  if (!response.ok) {
    if (response.status === 429) throw new TooManyRequests('alchemy', apiEnv)
    throw new NoTokensAvailable(tokenAddress, walletAddress)
  }
  const data = await response.json()

  owned = data.ownedNfts
    .filter(nft => nft.contract.address.toLowerCase() === tokenAddress.toLowerCase())
    .map(nft => nft.id.tokenId)

  return Promise.all(
    owned.map(async tokenId => {
      const url = new URL(`https://eth-${apiEnv}.alchemyapi.io/v2/${apiKey}/getNFTMetadata`)
      const searchParams = { contractAddress: tokenAddress, tokenId }
      Object.keys(searchParams).forEach(key => url.searchParams.append(key, searchParams[key]))

      const response = await fetch(url, { ...options, searchParams })
      if (!response.ok) {
        if (response.status === 429) throw new TooManyRequests('alchemy', apiEnv)
        throw new MissingMetadata(tokenAddress, tokenId)
      }

      return response.json()
    })
  )
}

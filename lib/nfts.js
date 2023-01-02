export async function nfts (tokenAddress, walletAddress, opts = {}) {
  if (!opts.alchemyApi || !opts.alchemyApi.key) {
    throw new Error('Missing Alchemy API key')
  }
  const apiKey = opts.alchemyApi.key
  const apiEnv = opts.alchemyApi.env || 'mainnet'

  const options = { mode: 'cors', redirect: 'follow', method: 'GET' }

  let owned = []
  try {
    const url = new URL(`https://eth-${apiEnv}.alchemyapi.io/v2/${apiKey}/getNFTs`)
    const searchParams = { owner: walletAddress }
    Object.keys(searchParams).forEach(key => url.searchParams.append(key, searchParams[key]))

    const response = await fetch(url, { ...options })
    if (!response.ok) {
      throw new Error('') // TODO
    }
    const data = await response.json()

    owned = data.ownedNfts
      .filter(nft => nft.contract.address.toLowerCase() === tokenAddress.toLowerCase())
      .map(nft => nft.id.tokenId)

  } catch (err) {
    throw new Error('Unable to load NFTs') // TODO
  }

  return Promise.all(
    owned.map(async tokenId => {
      const url = new URL(`https://eth-${apiEnv}.alchemyapi.io/v2/${apiKey}/getNFTMetadata`)
      const searchParams = { contractAddress: tokenAddress, tokenId }
      Object.keys(searchParams).forEach(key => url.searchParams.append(key, searchParams[key]))

      const response = await fetch(url, { ...options, searchParams })
      if (!response.ok) {
        throw new Error('') // TODO
      }

      return response.json()
    })
  )
}

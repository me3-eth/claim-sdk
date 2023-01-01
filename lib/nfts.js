export async function nftApi (tokenAddress, walletAddress, opts = {}) {
  if (!opts.alchemyApi || !opts.alchemyApi.key) {
    throw new Error('Missing Alchemy API key')
  }
  const apiKey = opts.alchemyApi.key
  const apiEnv = opts.alchemyApi.env || 'mainnet'

  const options = { mode: 'cors', redirect: 'follow', method: 'GET' }

  let owned = []
  try {
    const searchParams = new URLSearchParams({
      owner: walletAddress
    })
    const response = await fetch(`https://eth-${apiEnv}.alchemyapi.io/v2/${apiKey}/getNFTs`, { ...options, searchParams })
    if (!response.ok) {
      throw new Error('') // TODO
    }
    const data = await response.json()

    owned = data.ownedNfts
      .filter(nft => nft.contract.address.toLowerCase() === tokenAddress.toLowerCase())
      .map(nft => nft.id.tokenId)

  } catch (err) {
    throw new Error('Unable to load NFTs')
  }

  return Promise.all(
    owned.map(tokenId => {
      const searchParams = new URLSearchParams({
        contractAddress: tokenAddress,
        tokenId 
      })
      return ky.get(`https://eth-${apiEnv}.alchemyapi.io/v2/${apiKey}/getNFTMetadata`, { ...options, searchParams })
        .json()
    })
  )
}

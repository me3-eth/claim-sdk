import fetch from 'node-fetch'

if (!globalThis.fetch) globalThis.fetch = fetch

import { test } from 'tap'
import nock from 'nock'
import { nfts } from '../lib/nfts.js'

test('get nfts from alchemy', async (t) => {
  const opts = {
    alchemyApi: {
      key: 'abc',
      env: 'me3test'
    }
  }
  const tokenAddress = '0xdeadbeef'

  const alchemyApi = nock('https://eth-me3test.alchemyapi.io')
    .get('/v2/abc/getNFTs')
    .query({ owner: '0x0' })
    .reply(200, {
      ownedNfts: [
        {
          contract: { address: tokenAddress },
          id: { tokenId: '123' }
        }
      ]
    })
    .get('/v2/abc/getNFTMetadata')
    .query({ contractAddress: tokenAddress, tokenId: '123' })
    .reply(200, {
      stuff: 'exists'
    })

  const foundNfts = await nfts(tokenAddress, '0x0', opts)
  t.match(foundNfts, [{ stuff: 'exists' }])
  alchemyApi.done()
})

test('fail when missing alchemy api key', async (t) => {
  return t.rejects(nfts('0x0', '0x0'))
})

test('fails to get any nfts', async (t) => {
  const opts = {
    alchemyApi: {
      key: 'abc',
      env: 'me3test'
    }
  }
  const tokenAddress = '0xdeadbeef'

  const alchemyApi = nock('https://eth-me3test.alchemyapi.io')
    .get('/v2/abc/getNFTs')
    .query({ owner: '0x0' })
    .reply(500, { status: 'failed' })

  return t.rejects(nfts(tokenAddress, '0x0', opts))
})

test('fail if metadata cannot be loaded', async (t) => {
  const opts = {
    alchemyApi: { key: 'abc' }
  }
  const tokenAddress = '0xdeadbeef'

  const alchemyApi = nock('https://eth-mainnet.alchemyapi.io')
    .get('/v2/abc/getNFTs')
    .query({ owner: '0x0' })
    .reply(200, {
      ownedNfts: [
        {
          contract: { address: tokenAddress },
          id: { tokenId: '123' }
        }
      ]
    })
    .get('/v2/abc/getNFTMetadata')
    .query({ contractAddress: tokenAddress, tokenId: '123' })
    .reply(500, { status: 'failed' })

  return t.rejects(nfts(tokenAddress, '0x0', opts))
})

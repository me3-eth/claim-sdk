import fetch from 'node-fetch'

if (!globalThis.fetch) globalThis.fetch = fetch

import { afterEach, beforeEach, test } from 'tap'
// import { confirm, increaseBlock, mock, resetMocks } from '@depay/web3-mock-evm'
import * as Mockthereum from 'mockthereum'
import { ethers } from 'ethers'

import { claim } from '../lib/claim.js'
import { getAbi } from './helper.js'

const CALLER_ACCOUNT = '0xb25205ca60f964d45b30e969dc3f10a5de4ec3bc'
/*
const mockNode = Mockthereum.getLocal({ accounts: [CALLER_ACCOUNT]})

beforeEach(async () => {
  await mockNode.start()
  await mockNode.forBalance(CALLER_ACCOUNT).thenReturn(1000000)
})

afterEach(() => {
  mockNode.stop()
})
*/

test('fail if no provider set', async ({ rejects }) => {
  return rejects(claim('', ''), 'Must provide an EIP-1193, EIP-1102, EIP-3085 and EIP-3326 compliant provider')
})

test('register a subdomain', async (t) => {
  const registrar = await getAbi('Registrar')

  /*
  const mockedFunction = await mockNode.forSendTransactionTo('0x9f2daf90c4323b529c31a40520a5fa63eb601b84')
    .thenSucceed()
  */

  /*
  const mockedFunction = await mockNode.forCall('0x9f2daf90c4323b529c31a40520a5fa63eb601b84')
    .forFunction('function register(bytes32 node, string label, address owner, bytes[] blob)')
    .thenCloseConnection()
    */

  let registerMock = mock({
    window: globalThis,
    blockchain: 'ethereum',
    transaction: {
      delay: 1,
      to: '0x9f2daf90c4323b529c31a40520a5fa63eb601b84',
      from: '0xb25205ca60f964d45b30e969dc3f10a5de4ec3bc',
      /*
      api: registrar.abi,
      method: 'register',
      params: {
        node: '0x868437061435f35898f8ed7fb95d62ca53b460f0bb9d1c6be3bfd796e38d8636',
        label: 'charchar',
        owner: '0xb25205ca60f964d45b30e969dc3f10a5de4ec3bc',
        blob: []
      }
    },
    accounts: { return: ['0xb25205ca60f964d45b30e969dc3f10a5de4ec3bc'] },
    balance: {
      for: '0xb25205ca60f964d45b30e969dc3f10a5de4ec3bc',
      return: '232111122321'
    }
  })
  confirm(registerMock)
  */

  const provider = new ethers.providers.JsonRpcProvider(mockNode.url)
  console.log({ provider })

  const tx = await claim('me3.eth', 'charchar', { ownerAddress: '0xb25205ca60f964d45b30e969dc3f10a5de4ec3bc', provider })
  console.log({ tx })
  const result = await tx.wait(1)
  console.log({ result })
  /*
  increaseBlock(5)

  const receipt = await tx.wait(5)
  console.log('we are here', { receipt })

  t.ok(receipt.transactionHash)
  */
  //t.ok(registerMock.calls.count() > 1)
  const fnCalls = await mockedFunction.getRequests()
  t.ok(fnCalls.length === 1)
})

import { ethers } from 'ethers'
import { PROTOCOL_ADDRESS } from './constants.js'

/**
 * Claim a subdomain for a user
 * @dev Expectation that ENS formatting has been done beforehand to avoid problems
 * @returns Promise register subdomain with project
 */
export async function claim (domain, label, opts = {}) {
  if (!opts.provider || !ethers.providers.Provider.isProvider(opts.provider)) {
    throw new Error('Must provide an EIP-1193, EIP-1102, EIP-3085 and EIP-3326 compliant provider')
  }
  const signer = opts.provider.getSigner()

  const additionalData = opts.authData || []
  const node = ethers.utils.namehash(domain)
  const mintTo = opts.ownerAddress || await signer.getAddress()

  // create contract
  const abi = [
    'function register(bytes32,string,address,bytes[]) public'
  ]
  const protocol = new ethers.Contract(PROTOCOL_ADDRESS, abi, signer)

  // TODO need to narrow down the gasLimit
  return protocol.register(node, label, mintTo, additionalData, { gasLimit: 2000000 })
}

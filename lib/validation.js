import { ethers } from 'ethers'
import { PROTOCOL_ADDRESS } from './constants.js'

/**
 * @returns Promise<Boolean> check validity against `valid` function in Registrar
 */
export function validate (domain, label, opts = {}) {
  if (!opts.provider || !ethers.providers.Provider.isProvider(opts.provider)) {
    throw new Error('Must provide an EIP-1193, EIP-1102, EIP-3085 and EIP-3326 compliant provider')
  }
  const p = opts.provider

  const node = ethers.utils.namehash(domain)

  const abi = [
    'function valid(bytes32,string) external view returns (bool)'
  ]
  const protocol = new ethers.Contract(PROTOCOL_ADDRESS, abi, p)

  return protocol.valid(node, label)
}

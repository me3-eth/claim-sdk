import { ethers } from 'ethers'

const PROTOCOL_ADDRESS = '0x9fef5b1868de0c511121a3c354c28e2b741eb101'

export async function claim (domain, label, opts = {}) {
  if (!opts.provider) {
    throw new Error('Must provide an EIP-1193, EIP-1102, EIP-3085 and EIP-3326 compliant provider')
  }
  const p = new ethers.providers.Web3Provider(opts.provider)
  const signer = p.getSigner()

  // check if label is properly formatted
  // check if domain is properly formatted

  const additionalData = opts.authData || []
  const encodedAdditionalData = ethers.utils.defaultAbiCoder.encode(["uint256"], !Array.isArray(additionalData) ? [additionalData] : additionalData)

  const node = ethers.utils.namehash(domain)

  // create contract
  const abi = [
    'function register(bytes32,string,bytes) public'
  ]
  const protocol = new ethers.Contract(PROTOCOL_ADDRESS, abi, signer)

  // TODO need to narrow down the gasLimit
  return protocol.register(node, label, encodedAdditionalData, { gasLimit: 180000 })
}


import { ethers } from 'ethers'

// const PROTOCOL_ADDRESS = '0x9fef5b1868de0c511121a3c354c28e2b741eb101'
const PROTOCOL_ADDRESS = '0x9f2daf90c4323b529c31a40520a5fa63eb601b84'

export async function claim (domain, label, opts = {}) {
  if (!opts.provider || !ethers.providers.Provider.isProvider(opts.provider)) {
    throw new Error('Must provide an EIP-1193, EIP-1102, EIP-3085 and EIP-3326 compliant provider')
  }
  const signer = opts.provider.getSigner()
  console.log({ signer })

  // check if label is properly formatted
  // check if domain is properly formatted

  const additionalData = opts.authData || []
  const node = ethers.utils.namehash(domain)
  const mintTo = opts.ownerAddress || await signer.getAddress()

  // create contract
  const abi = [
    'function register(bytes32,string,address,bytes[]) public'
  ]
  const protocol = new ethers.Contract(PROTOCOL_ADDRESS, abi, signer)

  console.log('check protocol', { protocol })

  // TODO need to narrow down the gasLimit
  return protocol.register(node, label, mintTo, additionalData, { gasLimit: 2000000 })
}


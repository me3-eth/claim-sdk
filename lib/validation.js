/**
 * @returns Promise<Boolean> is the subdomain valid in regards to this project
 */
export function validate (domain, label, opts = {}) {
  if (!opts.provider) {
    throw new Error('Must provide an EIP-1193, EIP-1102, EIP-3085 and EIP-3326 compliant provider')
  }
  const p = new ethers.providers.Web3Provider(opts.provider)
  const signer = p.getSigner()

  const node = ethers.utils.namehash(domain)

  const abi = [
    'function valid(bytes32,string) external view returns (bool)'
  ]
  const protocol = new ethers.Contract(PROTOCOL_ADDRESS, abi, p)

  return protocol.valid(node, label)
}

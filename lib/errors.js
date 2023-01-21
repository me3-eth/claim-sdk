export class NoTokensAvailable extends Error {
  constructor (contract, wallet, err = {}) {
    super('No tokens available')

    this.contractAddresss = contract
    this.walletAddress = wallet
    this.statusCode = 400
    this._http_error = err
  }
}

export class MissingMetadata extends Error {
  constructor (contract, token, err = {}) {
    super('Metadata or URI missing')

    this.contractAddresss = contract
    this.tokenId = token
    this.statusCode = 400
    this._http_error = err
  }
}

export class TooManyRequests extends Error {
  constructor (provider, env, err = {}) {
    super('Too Many Requests made to provider')

    this.providerName = provider
    this.providerEnv = env
    this.statusCode = 429
    this._http_error = err
  }
}

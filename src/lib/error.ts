export class ClientError {
  type: 'client'
  name: string
  msg: string

  constructor(name: string, msg: string) {
    this.type = 'client'
    this.name = name
    this.msg = msg
  }
}

export class ServerError {
  type: 'server'
  msg: string

  constructor(msg: string) {
    this.type = 'server'
    this.msg = msg
  }
}

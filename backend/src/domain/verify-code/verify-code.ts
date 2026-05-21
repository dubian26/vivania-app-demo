
export interface VerifyCodeProps {
  id: string
  userId: string
  code: string
  purpose: string
  expiration: Date
  used: boolean
  createdAt: Date
}

export interface VerifyCodeCreate {
  id: string
  userId: string
  code: string
  purpose: string
  expiration: Date
}

export class VerifyCode {
  constructor(private props: VerifyCodeProps) { }

  get id() { return this.props.id }
  get userId() { return this.props.userId }
  get code() { return this.props.code }
  get purpose() { return this.props.purpose }
  get expiration() { return this.props.expiration }
  get used() { return this.props.used }
  get createdAt() { return this.props.createdAt }

  static create(data: VerifyCodeCreate): VerifyCode {
    return new VerifyCode({
      id: data.id,
      userId: data.userId,
      code: data.code,
      purpose: data.purpose,
      expiration: data.expiration,
      used: false,
      createdAt: new Date(),
    })
  }

  static fromDB(data: VerifyCodeProps) {
    return new VerifyCode(data)
  }

  toDB(): VerifyCodeProps {
    return this.props
  }

  toResult() {
    return {
      id: this.props.id,
      userId: this.props.userId,
      code: this.props.code,
      purpose: this.props.purpose,
      expiration: this.props.expiration,
      used: this.props.used,
      createdAt: this.props.createdAt,
    }
  }

  markAsUsed() {
    this.props.used = true
  }
}

declare module 'paynow' {
  export class Paynow {
    constructor(integrationId: string, integrationKey: string)
    resultUrl: string
    returnUrl: string
    
    createPayment(reference: string, email?: string): Payment
    send(payment: Payment): Promise<InitResponse>
    sendMobile(payment: Payment, phoneNumber: string, provider: string): Promise<InitResponse>
    pollTransaction(pollUrl: string): Promise<PollResponse>
    /** SHA512 of the concatenated field values + integration key, uppercased. */
    generateHash(values: Record<string, any>, integrationKey: string): string
    /** True when `values.hash` matches a hash generated from the other fields. */
    verifyHash(values: Record<string, any>): boolean
  }

  export class Payment {
    add(name: string, price: number): void
  }

  export interface InitResponse {
    success: boolean
    redirectUrl?: string
    pollUrl?: string
    instructions?: string
    error?: string
  }

  export interface PollResponse {
    paid(): boolean
    status: string
  }
} 
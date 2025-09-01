declare module 'paynow' {
  export class Paynow {
    constructor(integrationId: string, integrationKey: string)
    resultUrl: string
    returnUrl: string
    
    createPayment(reference: string, email?: string): Payment
    send(payment: Payment): Promise<InitResponse>
    sendMobile(payment: Payment, phoneNumber: string, provider: string): Promise<InitResponse>
    pollTransaction(pollUrl: string): Promise<PollResponse>
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
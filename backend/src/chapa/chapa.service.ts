import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChapaInitializePaymentDto {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: {
    title?: string;
    description?: string;
  };
}

export interface ChapaVerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: number;
    charge: number;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
    };
    meta: any;
    created_at: string;
    updated_at: string;
  };
}

@Injectable()
export class ChapaService {
  private readonly chapaSecretKey: string;
  private readonly chapaBaseUrl = 'https://api.chapa.co/v1';

  constructor(private configService: ConfigService) {
    this.chapaSecretKey = this.configService.get<string>('CHAPA_SECRET_KEY') || '';
  }

  async initializePayment(paymentData: ChapaInitializePaymentDto) {
    try {
      const response = await fetch(`${this.chapaBaseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.chapaSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HttpException(
          data.message || 'Failed to initialize payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Failed to initialize payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(txRef: string): Promise<ChapaVerifyPaymentResponse> {
    try {
      const response = await fetch(
        `${this.chapaBaseUrl}/transaction/verify/${txRef}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.chapaSecretKey}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new HttpException(
          data.message || 'Failed to verify payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Failed to verify payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateTxRef(): string {
    return `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}
// Commit 19 - 2024-05-09 21:40:00
// Commit 15 - 2024-05-05 18:43:00
// Commit 64 - 2024-05-21 14:28:00

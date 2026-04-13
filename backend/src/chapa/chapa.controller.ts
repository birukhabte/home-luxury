import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChapaService } from './chapa.service';

@Controller('chapa')
export class ChapaController {
  constructor(private readonly chapaService: ChapaService) {}

  @Post('initialize')
  async initializePayment(@Body() body: any) {
    const txRef = this.chapaService.generateTxRef();
    
    const paymentData = {
      amount: body.amount,
      currency: body.currency || 'ETB',
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
      tx_ref: txRef,
      callback_url: body.callback_url || `${process.env.FRONTEND_URL}/payment/callback`,
      return_url: body.return_url || `${process.env.FRONTEND_URL}/payment/verify?tx_ref=${txRef}`,
      customization: {
        title: body.customization?.title || 'Addis Majlis Glory',
        description: body.customization?.description || 'Payment for luxury furniture',
      },
    };

    return this.chapaService.initializePayment(paymentData);
  }

  @Get('verify')
  async verifyPayment(@Query('tx_ref') txRef: string) {
    return this.chapaService.verifyPayment(txRef);
  }
}

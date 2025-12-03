import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ example: '/uploads/banner1.jpg' })
  imagePath: string;
    
  @ApiProperty({ example: 'New Year Discount' })        
  name: string;

  @ApiProperty({ example: 'Special discount banner for New Year', required: false })
  description?: string;
}

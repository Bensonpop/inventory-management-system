import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateInventoryConfigDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Business created' })
  create(@Body() dto: CreateBusinessDto) {
    return this.businessService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
   @ApiResponse({
     status: 200,
     description: 'List of products',
     type: [Business],
   })
  findAll(@Body() dto: CreateBusinessDto) {
    return this.businessService.findAll();
  }

   @Get(':id')
     @ApiOperation({ summary: 'Get a Business by ID' })
     @ApiParam ({
       name: 'id',
       description: 'Business UUID',
       example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
     })
     @ApiResponse({
       status: 200,
       description: 'Business found',
       type: Business,
     })
     @ApiResponse({
       status: 404,
       description: 'Business not found',
     })
     findOne(@Param('id') id: string): Promise<Business> {
       return this.businessService.findById(id);
     }

  @Patch(':businessId/inventory-config')
  @ApiResponse({ status: 200, description: 'Inventory strategy updated' })
  updateInventoryConfig(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateInventoryConfigDto,
  ) {
    return this.businessService.updateInventoryConfig(businessId, dto);
  }
}

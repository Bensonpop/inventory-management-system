import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { Business } from './entities/business.entity';
import { UpdateInventoryConfigDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async create(dto: CreateBusinessDto): Promise<Business> {
    const business = this.businessRepo.create(dto);
    return this.businessRepo.save(business);
  }

  async findById(id: string): Promise<Business> {
    const business = await this.businessRepo.findOne({ where: { id } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  async findAll(): Promise<Business[]> {
      return this.businessRepo.find({ order: { createdAt: 'DESC' } });
    }


  async updateInventoryConfig(
    businessId: string,
    dto: UpdateInventoryConfigDto,
  ): Promise<Business> {
    const business = await this.findById(businessId);
    business.outMode = dto.outMode;
    return this.businessRepo.save(business);
  }
}

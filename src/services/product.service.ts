import { Repository } from 'typeorm';
import { Product } from '../entities/Product';
import { ProductType } from '../entities/ProductType';
import AppDataSource from '../config/ormconfig';

export class ProductService {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async create(data: Partial<Product>, productTypeId: number): Promise<Product | null> {
    const productTypeRepo = AppDataSource.getRepository(ProductType);
    const productType = await productTypeRepo.findOne({ where: { id: productTypeId } });

    if (!productType) return null;

    const product = this.repository.create({ ...data, productType });
    return await this.repository.save(product);
  }

  async getAll(): Promise<Product[]> {
    return await this.repository.find({ relations: ['productType'] });
  }

  async getById(id: number): Promise<Product | null> {
    return await this.repository.findOne({ where: { id }, relations: ['productType'] });
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;

    Object.assign(product, data);
    return await this.repository.save(product);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected === 1;
  }
}

import { UniqueEntityID } from 'src/core/src/entities';
import { Product, ProductProps } from 'src/domain/enterprise/product.entity';
import { faker } from '@faker-js/faker';

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.instance(
    {
      title: faker.commerce.productName(),
      image: faker.image.url(),
      price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
      rating: {
        rate: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        count: faker.number.int({ min: 1, max: 1000 }),
      },
      ...override,
    },
    id,
  );
  return product;
} 
import { Module } from '@nestjs/common'
import { ProductRepository } from 'src/domain/application/repositories/product-repository.contract'
import { FakeStoreApiService } from './fakestore-api.service'

@Module({
  providers: [
    FakeStoreApiService,
    {
      provide: ProductRepository,
      useClass: FakeStoreApiService,
    },
  ],
  exports: [ProductRepository],
})
export class ExternalModule {}

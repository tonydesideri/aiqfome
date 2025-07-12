import { Module } from '@nestjs/common'
import { EnvModule } from 'src/common/env'
import { Encrypter } from 'src/domain/application/cryptography/encrypter.contract'
import { Hasher } from 'src/domain/application/cryptography/hasher.contract'
import { ClientRepository } from 'src/domain/application/repositories/client-repository.contract'
import { FavoriteRepository } from 'src/domain/application/repositories/favorite-repository.contract'
import { ProductRepository } from 'src/domain/application/repositories/product-repository.contract'
import { UserRepository } from 'src/domain/application/repositories/user-repository.contract'
import { AddFavoriteUseCase } from 'src/domain/application/use-cases/add-favorite.use-case'
import { CreateClientUseCase } from 'src/domain/application/use-cases/create-client.use-case'
import { DeleteClientUseCase } from 'src/domain/application/use-cases/delete-client.use-case'
import { GetClientUseCase } from 'src/domain/application/use-cases/get-client.use-case'
import { GetFavoritesUseCase } from 'src/domain/application/use-cases/get-favorites.use-case'
import { ListClientsUseCase } from 'src/domain/application/use-cases/list-clients.use-case'
import { RemoveFavoriteUseCase } from 'src/domain/application/use-cases/remove-favorite.use-case'
import { SignInUseCase } from 'src/domain/application/use-cases/sign-in.use-case'
import { UpdateClientUseCase } from 'src/domain/application/use-cases/update-client.use-case'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { ExternalModule } from '../external/external.module'
import { AddFavoriteController } from './controllers/add-favorite.controller'
import { CreateClientController } from './controllers/create-client.controller'
import { DeleteClientController } from './controllers/delete-client.controller'
import { GetClientController } from './controllers/get-client.controller'
import { ListClientsController } from './controllers/list-clients.controller'
import { ListFavoritesController } from './controllers/list-favorites.controller'
import { RemoveFavoriteController } from './controllers/remove-favorite.controller'
import { SignInController } from './controllers/sign-in.controller'
import { UpdateClientController } from './controllers/update-client.controller'

@Module({
  imports: [EnvModule, DatabaseModule, CryptographyModule, ExternalModule],
  controllers: [
    SignInController,
    CreateClientController,
    GetClientController,
    ListClientsController,
    UpdateClientController,
    DeleteClientController,
    AddFavoriteController,
    ListFavoritesController,
    RemoveFavoriteController,
  ],
  providers: [
    {
      provide: SignInUseCase,
      useFactory: (
        userRepository: UserRepository,
        hasher: Hasher,
        encrypter: Encrypter
      ) => new SignInUseCase(userRepository, hasher, encrypter),
      inject: [UserRepository, Hasher, Encrypter],
    },
    {
      provide: CreateClientUseCase,
      useFactory: clientRepository => new CreateClientUseCase(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: GetClientUseCase,
      useFactory: clientRepository => new GetClientUseCase(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: ListClientsUseCase,
      useFactory: clientRepository => new ListClientsUseCase(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: UpdateClientUseCase,
      useFactory: clientRepository => new UpdateClientUseCase(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: DeleteClientUseCase,
      useFactory: clientRepository => new DeleteClientUseCase(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: AddFavoriteUseCase,
      useFactory: (favoriteRepository, productRepository) =>
        new AddFavoriteUseCase(favoriteRepository, productRepository),
      inject: [FavoriteRepository, ProductRepository],
    },
    {
      provide: GetFavoritesUseCase,
      useFactory: (favoriteRepository, productRepository) =>
        new GetFavoritesUseCase(favoriteRepository, productRepository),
      inject: [FavoriteRepository, ProductRepository],
    },
    {
      provide: RemoveFavoriteUseCase,
      useFactory: favoriteRepository =>
        new RemoveFavoriteUseCase(favoriteRepository),
      inject: [FavoriteRepository],
    },
  ],
})
export class HttpModule {}

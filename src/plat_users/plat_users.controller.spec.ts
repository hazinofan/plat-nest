import { Test, TestingModule } from '@nestjs/testing';
import { PlatUsersController } from './plat_users.controller';
import { PlatUsersService } from './plat_users.service';

describe('PlatUsersController', () => {
  let controller: PlatUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatUsersController],
      providers: [PlatUsersService],
    }).compile();

    controller = module.get<PlatUsersController>(PlatUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

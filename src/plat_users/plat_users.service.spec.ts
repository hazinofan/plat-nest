import { Test, TestingModule } from '@nestjs/testing';
import { PlatUsersService } from './plat_users.service';

describe('PlatUsersService', () => {
  let service: PlatUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatUsersService],
    }).compile();

    service = module.get<PlatUsersService>(PlatUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

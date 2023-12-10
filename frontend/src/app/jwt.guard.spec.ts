import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { jwtGuard } from './jwt.guard';

describe('jwtGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => jwtGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AuthAngularFireService } from './auth-angular-fire.service';

describe('AuthAngularFireService', () => {
  let service: AuthAngularFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAngularFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

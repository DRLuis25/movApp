import { TestBed } from '@angular/core/testing';

import { FirestoreDBService } from './firestore-db.service';

describe('FirestoreDBService', () => {
  let service: FirestoreDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

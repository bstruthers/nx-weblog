import { TestBed } from '@angular/core/testing';

import { StructureResolver } from './structure.resolver';

describe('StructureResolver', () => {
  let resolver: StructureResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StructureResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

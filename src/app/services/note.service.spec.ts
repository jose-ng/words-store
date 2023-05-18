import { TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NoteService],
    });
    service = TestBed.inject(NoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EndComponent } from './end';

describe('End Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [EndComponent]});
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(EndComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('End Works!');
  });

});

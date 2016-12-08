import { TestBed } from '@angular/core/testing';

import { FernsehrComponent } from './fernsehr.component';

describe('Fernsehr Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FernsehrComponent]});
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(FernsehrComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('Fernsehr Works!');
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WewViewComponent } from './wew-view.component';

describe('WewViewComponent', () => {
  let component: WewViewComponent;
  let fixture: ComponentFixture<WewViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WewViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

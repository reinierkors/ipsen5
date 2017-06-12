import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatersComponent } from './waters.component';

describe('WatersComponent', () => {
  let component: WatersComponent;
  let fixture: ComponentFixture<WatersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

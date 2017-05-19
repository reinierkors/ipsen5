import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleEditComponent } from './sample-edit.component';

describe('SampleEditComponent', () => {
  let component: SampleEditComponent;
  let fixture: ComponentFixture<SampleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleLocationTableComponent } from './sample-location-table.component';

describe('SampleLocationTableComponent', () => {
  let component: SampleLocationTableComponent;
  let fixture: ComponentFixture<SampleLocationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleLocationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleLocationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


});

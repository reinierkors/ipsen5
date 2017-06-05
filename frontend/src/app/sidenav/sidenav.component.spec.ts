import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatieComponent } from './sidenav.component';

describe('NavigatieComponent', () => {
  let component: NavigatieComponent;
  let fixture: ComponentFixture<NavigatieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigatieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigatieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WewUploadComponent } from './wew-upload.component';

describe('WewUploadComponent', () => {
  let component: WewUploadComponent;
  let fixture: ComponentFixture<WewUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WewUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WewUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

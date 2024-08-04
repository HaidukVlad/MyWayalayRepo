import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPartComponent } from './registration-part.component';

describe('RegistrationPartComponent', () => {
  let component: RegistrationPartComponent;
  let fixture: ComponentFixture<RegistrationPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

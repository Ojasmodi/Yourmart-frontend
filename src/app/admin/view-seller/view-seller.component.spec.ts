import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellerComponent } from './view-seller.component';

describe('ViewSellerComponent', () => {
  let component: ViewSellerComponent;
  let fixture: ComponentFixture<ViewSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AberturaCaixaComponent } from './abertura-caixa.component';

describe('AberturaCaixaComponent', () => {
  let component: AberturaCaixaComponent;
  let fixture: ComponentFixture<AberturaCaixaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AberturaCaixaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AberturaCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

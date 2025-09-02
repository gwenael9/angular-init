import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: '<div [appHighlight]="color" [appHighlightDelay]="delay">Test</div>',
})
class TestComponent {
  color = 'yellow';
  delay = 0;
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should apply highlight color', fakeAsync(() => {
    component.color = 'red';
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');
    expect(element.style.backgroundColor).toBe('red');
  }));
});

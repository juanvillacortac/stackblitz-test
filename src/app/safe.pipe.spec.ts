import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  let sanitizer: DomSanitizer;
  it('create an instance', () => {
    const pipe = new SafePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});

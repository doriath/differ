import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import if using ngModel in template, not strictly needed for these tests
import { NgxDiffModule } from 'ngx-diff';
import * as yaml from 'js-yaml';

import { Diff as DiffComponent } from './diff'; // Renamed to DiffComponent for clarity in tests

describe('DiffComponent', () => {
  let component: DiffComponent;
  let fixture: ComponentFixture<DiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiffComponent],
      imports: [
        NgxDiffModule,
        // FormsModule // Add if template uses forms features like ngModel that need it
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(component.leftContentForDiff).toBe('');
    expect(component.rightContentForDiff).toBe('');
    expect(component.errorMessage).toBeNull();
  });

  describe('generateDiff', () => {
    it('should parse valid YAML and set left/right content', () => {
      const leftYaml = 'name: John Doe\nage: 30';
      const rightYaml = 'name: Jane Doe\nage: 32';

      component.generateDiff(leftYaml, rightYaml);

      expect(component.errorMessage).toBeNull();
      // js-yaml might add a trailing newline
      expect(component.leftContentForDiff.trim()).toBe(yaml.dump(yaml.load(leftYaml)).trim());
      expect(component.rightContentForDiff.trim()).toBe(yaml.dump(yaml.load(rightYaml)).trim());
    });

    it('should set error message for invalid left YAML', () => {
      const leftYaml = 'name: John Doe\nage: 30\ninvalid: yaml: here';
      const rightYaml = 'name: Jane Doe\nage: 32';

      component.generateDiff(leftYaml, rightYaml);

      expect(component.errorMessage).toContain('Error parsing left YAML input');
      expect(component.leftContentForDiff).toBe('');
      expect(component.rightContentForDiff).toBe('');
    });

    it('should set error message for invalid right YAML', () => {
      const leftYaml = 'name: John Doe\nage: 30';
      const rightYaml = 'name: Jane Doe\nage: 32\ninvalid: yaml: here';

      component.generateDiff(leftYaml, rightYaml);

      expect(component.errorMessage).toContain('Error parsing right YAML input');
      expect(component.leftContentForDiff).toBe('');
      expect(component.rightContentForDiff).toBe('');
    });

    it('should set error message for both invalid YAML inputs', () => {
      const leftYaml = 'name: John Doe\nage: 30\ninvalid: left';
      const rightYaml = 'name: Jane Doe\nage: 32\ninvalid: right';

      component.generateDiff(leftYaml, rightYaml);

      // It will report the first error (left)
      expect(component.errorMessage).toContain('Error parsing left YAML input');
      expect(component.leftContentForDiff).toBe('');
      expect(component.rightContentForDiff).toBe('');
    });

    it('should handle empty string inputs as valid (empty content)', () => {
      component.generateDiff('', '');

      expect(component.errorMessage).toBeNull();
      // yaml.dump({}) results in "{}\n" or just "{}" depending on options,
      // and yaml.dump(null) or yaml.dump(undefined) can result in "null\n" or empty string.
      // The component logic converts null/undefined from load to {} before dump.
      expect(component.leftContentForDiff.trim()).toBe(yaml.dump({}).trim());
      expect(component.rightContentForDiff.trim()).toBe(yaml.dump({}).trim());
    });

    it('should handle YAML with only comments as valid (empty content)', () => {
      const leftYaml = '# This is a comment only\n# Another comment';
      const rightYaml = '# Right side comment';

      component.generateDiff(leftYaml, rightYaml);

      expect(component.errorMessage).toBeNull();
      // yaml.load for comments only results in undefined or null.
      // The component logic converts this to {} before dump.
      expect(component.leftContentForDiff.trim()).toBe(yaml.dump({}).trim());
      expect(component.rightContentForDiff.trim()).toBe(yaml.dump({}).trim());
    });

    it('should correctly parse and dump a slightly more complex valid YAML', () => {
      const leftYaml = 'user:\n  name: Alice\n  details:\n    - type: email\n      value: alice@example.com\n    - type: phone\n      value: "1234567890"';
      const rightYaml = 'user:\n  name: Alice\n  details:\n    - type: email\n      value: alice_new@example.com\n    - type: phone\n      value: "0987654321"';

      component.generateDiff(leftYaml, rightYaml);

      expect(component.errorMessage).toBeNull();
      expect(component.leftContentForDiff.trim()).toBe(yaml.dump(yaml.load(leftYaml)).trim());
      expect(component.rightContentForDiff.trim()).toBe(yaml.dump(yaml.load(rightYaml)).trim());
    });
  });
});

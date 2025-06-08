import { Component } from '@angular/core';
import * as yaml from 'js-yaml';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.html',
  styleUrls: ['./diff.css'] // Changed styleUrl to styleUrls
})
export class Diff { // Class name kept as Diff
  leftContentForDiff: string = '';
  rightContentForDiff: string = '';
  errorMessage: string | null = null;

  constructor() { }

  generateDiff(yamlLeftInput: string, yamlRightInput: string): void {
    this.errorMessage = null;
    this.leftContentForDiff = '';
    this.rightContentForDiff = '';

    let leftYamlObject: any;
    let rightYamlObject: any;

    try {
      leftYamlObject = yaml.load(yamlLeftInput);
    } catch (e: any) {
      this.errorMessage = `Error parsing left YAML input: ${e.message}`;
      return;
    }

    try {
      rightYamlObject = yaml.load(yamlRightInput);
    } catch (e: any) {
      this.errorMessage = `Error parsing right YAML input: ${e.message}`;
      return;
    }

    // Handle cases where YAML might be empty or just comments, resulting in null/undefined
    if (leftYamlObject === null || leftYamlObject === undefined) {
        leftYamlObject = {}; // Treat as empty object for consistent dumping
    }
    if (rightYamlObject === null || rightYamlObject === undefined) {
        rightYamlObject = {}; // Treat as empty object for consistent dumping
    }

    // Convert back to canonical YAML strings
    try {
      this.leftContentForDiff = yaml.dump(leftYamlObject);
    } catch (e: any) {
      this.errorMessage = `Error converting left YAML back to string: ${e.message}`;
      return;
    }

    try {
      this.rightContentForDiff = yaml.dump(rightYamlObject);
    } catch (e: any) {
      this.errorMessage = `Error converting right YAML back to string: ${e.message}`;
      return;
    }
  }
}
overwrite_file_with_block
yaml-diff-app/src/app/diff/diff.html
<h1>YAML Diff Tool</h1>

<div>
  <textarea #yamlLeft rows="10" cols="50" placeholder="Enter first YAML here"></textarea>
  <textarea #yamlRight rows="10" cols="50" placeholder="Enter second YAML here"></textarea>
</div>

<button (click)="generateDiff(yamlLeft.value, yamlRight.value)">Generate Diff</button>

<p *ngIf="errorMessage" style="color: red;">{{ errorMessage }}</p>

<div>
  <h2>Diff Output:</h2>
  <ngx-diff [left]="leftContentForDiff" [right]="rightContentForDiff" format="side-by-side" theme="light"></ngx-diff>
</div>

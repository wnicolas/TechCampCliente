import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mass-assignment',
  templateUrl: './mass-assignment.component.html',
  styleUrls: ['./mass-assignment.component.css'],
})
export class MassAssignmentComponent implements OnInit {
  constructor() {}
  @Output() executeMassAssignmentEvent = new EventEmitter<String>();

  @Input() massAssignmentState:
    | 'Executing'
    | 'Canceled'
    | 'Inactive'
    | 'Contractors Selected' = 'Inactive';
  ngOnInit(): void {}

  activateMassAssignment() {
    this.massAssignmentState = 'Executing';
    this.executeMassAssignmentEvent.emit(this.massAssignmentState);
  }
  deactivateMassAssignment() {
    this.massAssignmentState = 'Inactive';
    this.executeMassAssignmentEvent.emit(this.massAssignmentState);
  }
  continueMassAssignment() {
    this.massAssignmentState = 'Contractors Selected';
    this.executeMassAssignmentEvent.emit(this.massAssignmentState);
  }
}

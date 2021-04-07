import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import iData from '../../models/direction-data.model';
import { HobbyService } from './hobby.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hobby-select',
  templateUrl: './hobby-select.component.html',
  styleUrls: ['./hobby-select.component.scss']
})
export class HobbySelectComponent implements OnInit {
  constructor(
    private service: HobbyService,
    private formBuilder: FormBuilder) {
    this.SelectFormGroup = this.formBuilder.group({
      selectedDirection : new FormControl(''),
      selectedFaculty : new FormControl(''), 
      selectedStudy : new FormControl(''),
    });
    }
  @Output() passSelectFormGroup = new EventEmitter();
  SelectFormGroup: FormGroup;
  data: iData[] = [];
  direction: string[] = [];
  faculty: string[] = [];
  study: string[] = [];

  ngOnInit(): void {
    this.passSelectFormGroup.emit(this.SelectFormGroup);
    this.service.getData().subscribe((data: iData[]) => {
      this.data = data;
      this.getDirections(data);
    });
  }

  getDirections(data: iData[]): void {
    this.direction = data.map(el => el.direction);
  }

  handleDirectionSelect(value: string): void {
    this.SelectFormGroup.get('selectedDirection').setValue(value);
    this.SelectFormGroup.get('selectedFaculty').setValue('');
    this.SelectFormGroup.get('selectedStudy').setValue('');
    const targetDirection = this.data.find(el => el.direction === value);
    const facultyList = targetDirection?.faculty.map(el => el.name);
    this.faculty = facultyList;
  }

  handleFacultySelect(value: string): void {
    this.SelectFormGroup.get('selectedFaculty').setValue(value);
    this.SelectFormGroup.get('selectedStudy').setValue('');
    const targetDirection = this.data.find(el => el.direction === this.SelectFormGroup.get('selectedDirection').value);
    const targetFaculty = targetDirection?.faculty.find(el => el.name === value);
    const studyList = targetFaculty.study;
    this.study = studyList;
  }

  handleStudySelect(value: string): void {
    this.SelectFormGroup.get('selectedStudy').setValue(value);
  }
}

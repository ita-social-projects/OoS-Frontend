import { Component, OnInit } from '@angular/core';
import iData from '../../models/direction-data.model';
import { HobbyService } from './hobby.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hobby-select',
  templateUrl: './hobby-select.component.html',
  styleUrls: ['./hobby-select.component.scss']
})
export class HobbySelectComponent implements OnInit {
  constructor(private service: HobbyService) { }

  //lists of options in dropdowns
  data: iData[] = [];
  direction: string[] = [];
  faculty: string[] = [];
  study: string[] = [];
  selectedDirection = new FormControl(''); //contains current state (which direction was selected)
  selectedFaculty = new FormControl('');
  selectedStudy = new FormControl('');

  ngOnInit(): void {
    // takes mock data from service and sets direction list to this.direction
    // TODO: replace with Get request or @Select from store !!!
    this.service.getData().subscribe((data: iData[]) => {
      this.data = data;
      this.getDirections(data);
    });
  }

  getDirections(data: iData[]): void {
    this.direction = data.map(el => el.direction);
  }

  handleDirectionSelect(value: string): void {
    //sets selected option in current "state"
    this.selectedDirection.setValue(value);
    //clears selected faculty and study (all dropdowns should be consistant)
    this.selectedFaculty.setValue('');
    this.selectedStudy.setValue('');
    //finds faculties, related to selected direction
    const targetDirection = this.data.find(el => el.direction === value);
    //creates list of options for 2d dropdown
    const facultyList = targetDirection?.faculty.map(el => el.name);
    //sets list of options in this.faculty
    this.faculty = facultyList;
  }

  handleFacultySelect(value: string): void {
    //the same logic as for handleDirectionSelect
    this.selectedFaculty.setValue(value);
    this.selectedStudy.setValue('');
    const targetDirection = this.data.find(el => el.direction === this.selectedDirection.value);
    const targetFaculty = targetDirection?.faculty.find(el => el.name === value);
    const studyList = targetFaculty.study;
    this.study = studyList;
  }

  handleStudySelect(value: string): void {
    this.selectedStudy.setValue(value);
  }
}

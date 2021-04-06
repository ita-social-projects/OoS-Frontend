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

  data: iData[] = [];
  direction: string[] = [];
  faculty: string[] = [];
  study: string[] = [];
  selectedDirection = new FormControl('');
  selectedFaculty = new FormControl('');
  selectedStudy = new FormControl('');

  ngOnInit(): void {
    this.service.getData().subscribe((data: iData[]) => {
      this.data = data;
      this.getDirections(data);
    });
  }

  getDirections(data: iData[]): void {
    this.direction = data.map(el => el.direction);
  }

  handleDirectionSelect(value: string): void {
    this.selectedDirection.setValue(value);
    this.selectedFaculty.setValue('');
    this.selectedStudy.setValue('');
    const targetDirection = this.data.find(el => el.direction === value);
    const facultyList = targetDirection?.faculty.map(el => el.name);
    this.faculty = facultyList;
  }

  handleFacultySelect(value: string): void {
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

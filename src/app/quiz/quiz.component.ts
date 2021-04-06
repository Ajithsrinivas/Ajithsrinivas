import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'pageSize': 1,
    'showPager': false
  };
  check: boolean = true;
  message: boolean = false;
  pager = {
    index: 0,
    size: 1,
    count: 1
  };

   // Pie
   public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = [ 'correct', 'incorrect'];
  public pieChartData: SingleDataSet = [5, 5];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
 
  constructor(private quizService: QuizService) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;

    });
    this.mode = 'quiz';
  }


  get filteredQuestions() {
      return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { 
        if (x.id !== option.id) {
          x.selected = false; 
          this.message = false;
        } 
      });
    }

    let count = 0;
    question.options.forEach((option) => { 
        if(option.selected === true){
        count++;
      }
    });

    if (count === 0){
      this.check = true;
    } else{
      this.check = false;
    }

  }


  piechart(){
    let i = 0, j = 0;
    this.quiz.questions.forEach(function (question) {
      question.options.every(x => x.selected === x.isAnswer) ? i++ : j++;
    });
    this.pieChartData =  [i, j];
    this.mode = 'review';
  }

  goTo(index: number, val:any) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
    this.check = val;
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmitAll() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));
    console.log(this.quiz.questions);
    this.mode = 'result';
  }

}
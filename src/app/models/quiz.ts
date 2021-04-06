import { QuizConfig } from './quiz-config';
import { Question } from './question';

export class Quiz {
    id: number;
    name: string;
    description: string;
    config: QuizConfig;
    questions: Question[];

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.config = new QuizConfig(data.config);
            this.questions = [];
            let random = [];
            for (let i = 0; i < data.questions.length; i++) {
                random.push(data.questions[Math.floor(Math.random() * data.questions.length)]);
             }
             random.forEach(q => {
                this.questions.push(new Question(q));
            });
        }
    }
}

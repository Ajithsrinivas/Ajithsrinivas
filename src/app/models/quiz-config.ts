export class QuizConfig {
    allowBack: boolean;
    allowReview: boolean;
    autoMove: boolean;  // if boolean; it will move to next question automatically when answered.
    pageSize: number;
    showPager: boolean;


    constructor(data: any) {
        data = data || {};
        this.allowBack = data.allowBack;
        this.allowReview = data.allowReview;
        this.autoMove = data.autoMove;
        this.pageSize = data.pageSize;
        this.showPager = data.showPager;
    }
}
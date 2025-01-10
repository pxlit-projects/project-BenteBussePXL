export class Review {
    id: number;
    postId: number;
    postTitle: string;
    comment: string;
    reviewer: string;
    reviewedAt: Date;
    status: string;

    constructor(id: number, postId: number, postTitle: string, comment: string, reviewer: string, reviewedAt: Date, status: string) {
        this.id = id;
        this.postId = postId;
        this.postTitle = postTitle;
        this.comment = comment;
        this.reviewer = reviewer;
        this.status = status;
        this.reviewedAt = reviewedAt;
    }
  }
  
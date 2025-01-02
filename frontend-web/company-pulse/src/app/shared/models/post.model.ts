export class Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    isDaft: boolean;

    constructor(id: number, title: string, content: string, author: string, createdAt: Date, isDraft: boolean = false) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.author = author;
      this.createdAt = createdAt;
      this.isDaft = isDraft;
    }
  }
  
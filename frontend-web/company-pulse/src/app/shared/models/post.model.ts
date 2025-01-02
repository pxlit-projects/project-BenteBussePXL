export class Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: Date;
    isDaft: boolean;

    constructor(id: number, title: string, content: string, author: string, date: Date, isDraft: boolean = false) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
      this.isDaft = isDraft;
    }
  }
  
export class Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: Date;

    constructor(id: number, title: string, content: string, author: string, date: Date) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
    }
  }
  
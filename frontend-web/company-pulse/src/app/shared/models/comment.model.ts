export class Comment {
    id: number;
    postId: number;
    content: string;
    author: string;
    createdAt: Date;
    isEdited: boolean;

    constructor(id: number, postId: number, content: string, author: string, createdAt: Date, isEdited: boolean) {
        this.id = id;
        this.postId = postId;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
        this.isEdited = isEdited;
    }
}
export class Notification {
    id: number;
    sender: string;
    receiver: string;
    subject: string;
    message: string;
    createdAt: Date;
    postId: number;
    isRead: boolean;

    constructor(id: number, sender: string, receiver: string, subject: string, message: string, postId: number, createdAt: Date, isRead: boolean) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.subject = subject;
        this.message = message;
        this.createdAt = createdAt;
        this.postId = postId;
        this.isRead = isRead;
    }
}
  
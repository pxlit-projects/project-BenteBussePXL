package be.pxl.companypulse.api;

import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.net.URI;

@RestController
@RequestMapping("comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest) {
        try {
            this.commentService.createComment(commentRequest);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("{postId}")
    public ResponseEntity<?> getAllComments(@PathVariable Long postId) {
        try {
            return new ResponseEntity<>(this.commentService.getAllCommentsByPost(postId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

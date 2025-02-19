package be.pxl.companypulse.api;

import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.api.dto.CommentUpdateRequest;
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

    @PutMapping("{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody CommentUpdateRequest commentRequest) {
        try {
            this.commentService.updateComment(id, commentRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            this.commentService.deleteComment(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

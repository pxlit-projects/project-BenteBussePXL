package be.pxl.companypulse.api;

import be.pxl.companypulse.api.dto.PostRequest;
import be.pxl.companypulse.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostRequest postRequest) {
        try {
            Long id = postService.createPost(postRequest);
            return ResponseEntity.created(URI.create("/posts/" + id)).build();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getPosts() {
        return ResponseEntity.ok(postService.getPosts());
    }
}

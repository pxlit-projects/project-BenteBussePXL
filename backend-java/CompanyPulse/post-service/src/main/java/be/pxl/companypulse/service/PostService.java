package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.PostRequest;
import be.pxl.companypulse.domain.Post;
import be.pxl.companypulse.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    public Long createPost(PostRequest postRequest) {
        Post post = new Post(postRequest.title(), postRequest.content(), postRequest.author());
        postRepository.save(post);
        return post.getId();
    }
}

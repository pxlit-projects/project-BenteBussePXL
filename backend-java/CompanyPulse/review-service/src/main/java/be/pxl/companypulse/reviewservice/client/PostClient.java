package be.pxl.companypulse.reviewservice.client;

import be.pxl.companypulse.reviewservice.api.dto.PostDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@FeignClient(name = "post-service")
public interface PostClient {
    @GetMapping("/posts/pending")
    List<PostDTO> getPendingPosts();

    @PostMapping("/posts/{id}/approve")
    void approvePost(@PathVariable String id);

    @PostMapping("/posts/{id}/reject")
    void rejectPost(@PathVariable String id);
}

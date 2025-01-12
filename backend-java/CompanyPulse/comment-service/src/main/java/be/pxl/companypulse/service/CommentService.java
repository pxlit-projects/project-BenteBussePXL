package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.CommentDTO;
import be.pxl.companypulse.api.dto.CommentRequest;

import java.util.List;

public interface CommentService {
    void createComment(CommentRequest commentRequest);

    List<CommentDTO> getAllCommentsByPost(Long postId);
}

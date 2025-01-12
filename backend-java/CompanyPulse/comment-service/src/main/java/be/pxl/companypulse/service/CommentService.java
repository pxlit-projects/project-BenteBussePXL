package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.CommentDTO;
import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.api.dto.CommentUpdateRequest;

import java.util.List;

public interface CommentService {
    void createComment(CommentRequest commentRequest);

    List<CommentDTO> getAllCommentsByPost(Long postId);

    void updateComment(Long id, CommentUpdateRequest commentRequest);

    void deleteComment(Long id);
}

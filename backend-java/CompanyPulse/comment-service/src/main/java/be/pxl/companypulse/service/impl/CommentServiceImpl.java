package be.pxl.companypulse.service.impl;

import be.pxl.companypulse.api.dto.CommentDTO;
import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.api.dto.CommentUpdateRequest;
import be.pxl.companypulse.domain.Comment;
import be.pxl.companypulse.repository.CommentRepository;
import be.pxl.companypulse.service.CommentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public void createComment(CommentRequest commentRequest) {
        Comment newComment = Comment.builder()
                .content(commentRequest.content())
                .postId(commentRequest.postId())
                .author(commentRequest.author())
                .createdAt(LocalDateTime.now())
                .isEdited(false)
                .build();
        this.commentRepository.save(newComment);
    }

    @Override
    public List<CommentDTO> getAllCommentsByPost(Long postId) {
        return this.commentRepository.findAll().stream()
                .filter(comment -> comment.getPostId() == postId)
                .map(comment -> CommentDTO.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .postId(comment.getPostId())
                        .author(comment.getAuthor())
                        .createdAt(comment.getCreatedAt())
                        .isEdited(comment.isEdited())
                        .build())
                .toList();
    }

    @Override
    public void updateComment(Long id, CommentUpdateRequest commentRequest) {
        Comment comment = this.commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.edit(commentRequest.content());
        this.commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long id) {
        this.commentRepository.deleteById(id);
    }
}
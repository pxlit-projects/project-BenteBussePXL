package be.pxl.companypulse.service.impl;

import be.pxl.companypulse.api.dto.CommentDTO;
import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.api.dto.CommentUpdateRequest;
import be.pxl.companypulse.domain.Comment;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.repository.CommentRepository;
import be.pxl.companypulse.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public void createComment(CommentRequest commentRequest) {
        log.info("Entered method createComment");
        Comment newComment = Comment.builder()
                .content(commentRequest.content())
                .postId(commentRequest.postId())
                .author(commentRequest.author())
                .createdAt(LocalDateTime.now())
                .isEdited(false)
                .build();
        this.commentRepository.save(newComment);
        log.info("Comment created with id: {}", newComment.getId());
    }

    @Override
    public List<CommentDTO> getAllCommentsByPost(Long postId) {
        log.info("Entered method getAllCommentsByPost");
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
        log.info("Entered method updateComment");
        Comment comment = this.commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Comment not found with id: {}", id);
                    return new NotFoundException("Comment not found");
                });
        comment.edit(commentRequest.content());
        this.commentRepository.save(comment);
        log.info("Comment updated with id: {}", id);
    }

    @Override
    public void deleteComment(Long id) {
        log.info("Entered method deleteComment");
        this.commentRepository.deleteById(id);
        log.info("Comment deleted with id: {}", id);
    }
}
package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;

/**
 * REST controller for managing articles.
 */

@Tag(name = "articles")
@RequestMapping("/api/articles")
@RestController
@Slf4j
public class ArticlesController extends ApiController {

    @Autowired
    ArticlesRepository articlesRepository;

    /**
     * List all articles.
     * 
     * @return iterable of all articles
     */
    @Operation(summary = "List all articles")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Articles> allArticles() {
        return articlesRepository.findAll();
    }

    /**
     * Get a single article by ID.
     * 
     * @param id ID of the article to retrieve
     * @return the requested article
     */
    @Operation(summary = "Get a single article by ID")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Articles getById(@Parameter(name = "id") @RequestParam Long id) {
        return articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));
    }

    /**
     * Create a new article.
     * 
     * @param title       title of the article
     * @param url         URL of the article
     * @param explanation explanation of the article
     * @param email       email of the article creator
     * @param dateAdded   date the article was added
     * @return the newly created article
     */
    @Operation(summary = "Create a new article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Articles postArticle(
            @Parameter(name = "title") @RequestParam String title,
            @Parameter(name = "url") @RequestParam String url,
            @Parameter(name = "explanation") @RequestParam String explanation,
            @Parameter(name = "email") @RequestParam String email,
            @Parameter(name = "dateAdded") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateAdded) {

        Articles article = Articles.builder()
                .title(title)
                .url(url)
                .explanation(explanation)
                .email(email)
                .dateAdded(dateAdded)
                .build();

        return articlesRepository.save(article);
    }

    /**
     * Update an existing article.
     * 
     * @param id       ID of the article to update
     * @param incoming article data to update with
     * @return the updated article
     */
    @Operation(summary = "Update an existing article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Articles updateArticle(
            @Parameter(name = "id") @RequestParam Long id,
            @RequestBody @Valid Articles incoming) {

        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        article.setTitle(incoming.getTitle());
        article.setUrl(incoming.getUrl());
        article.setExplanation(incoming.getExplanation());
        article.setEmail(incoming.getEmail());
        article.setDateAdded(incoming.getDateAdded());

        return articlesRepository.save(article);
    }

    /**
     * Delete an article by ID.
     * 
     * @param id ID of the article to delete
     * @return confirmation message
     */
    @Operation(summary = "Delete an article by ID")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteArticle(@Parameter(name = "id") @RequestParam Long id) {
        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        articlesRepository.delete(article);
        return genericMessage("Article with id %s deleted".formatted(id));
    }
}
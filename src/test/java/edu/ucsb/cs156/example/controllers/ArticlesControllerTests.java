package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = ArticlesController.class)
@Import(TestConfig.class)
public class ArticlesControllerTests extends ControllerTestCase {

    @MockBean
    ArticlesRepository articlesRepository;

    @MockBean
    UserRepository userRepository;

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/articles/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/articles/all"))
                .andExpect(status().is(200));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        LocalDateTime ldt = LocalDateTime.parse("2023-10-29T00:00:00");
        Articles article = Articles.builder()
                .title("Test Title")
                .url("http://example.com")
                .explanation("Explanation text")
                .email("test@example.com")
                .dateAdded(ldt)
                .build();

        when(articlesRepository.findById(eq(7L))).thenReturn(Optional.of(article));

        MvcResult response = mockMvc.perform(get("/api/articles?id=7"))
                .andExpect(status().isOk()).andReturn();

        verify(articlesRepository, times(1)).findById(eq(7L));
        String expectedJson = mapper.writeValueAsString(article);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {
        when(articlesRepository.findById(eq(7L))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(get("/api/articles?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        verify(articlesRepository, times(1)).findById(eq(7L));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Articles with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_articles() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2023-10-29T00:00:00");
        Articles article1 = Articles.builder()
                .title("Title1")
                .url("http://example1.com")
                .explanation("Explanation1")
                .email("test1@example.com")
                .dateAdded(ldt1)
                .build();

        LocalDateTime ldt2 = LocalDateTime.parse("2023-10-30T00:00:00");
        Articles article2 = Articles.builder()
                .title("Title2")
                .url("http://example2.com")
                .explanation("Explanation2")
                .email("test2@example.com")
                .dateAdded(ldt2)
                .build();

        ArrayList<Articles> expectedArticles = new ArrayList<>(Arrays.asList(article1, article2));
        when(articlesRepository.findAll()).thenReturn(expectedArticles);

        MvcResult response = mockMvc.perform(get("/api/articles/all"))
                .andExpect(status().isOk()).andReturn();

        verify(articlesRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedArticles);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void an_admin_user_can_post_a_new_article() throws Exception {
        LocalDateTime ldt = LocalDateTime.parse("2023-10-29T00:00:00");

        Articles article = Articles.builder()
                .title("Test Title")
                .url("http://example.com")
                .explanation("Explanation text")
                .email("test@example.com")
                .dateAdded(ldt)
                .build();

        when(articlesRepository.save(eq(article))).thenReturn(article);

        MvcResult response = mockMvc.perform(
                post("/api/articles/post")
                        .param("title", "Test Title")
                        .param("url", "http://example.com")
                        .param("explanation", "Explanation text")
                        .param("email", "test@example.com")
                        .param("dateAdded", "2023-10-29T00:00:00")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(articlesRepository, times(1)).save(article);
        String expectedJson = mapper.writeValueAsString(article);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_can_delete_an_article() throws Exception {
        LocalDateTime ldt = LocalDateTime.parse("2023-10-29T00:00:00");

        Articles article = Articles.builder()
                .title("Test Title")
                .url("http://example.com")
                .explanation("Explanation text")
                .email("test@example.com")
                .dateAdded(ldt)
                .build();

        when(articlesRepository.findById(eq(15L))).thenReturn(Optional.of(article));

        MvcResult response = mockMvc.perform(
                delete("/api/articles?id=15")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(articlesRepository, times(1)).findById(15L);
        verify(articlesRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("Article with id 15 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_can_edit_an_existing_article_and_verify_each_field() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2023-10-29T00:00:00");
        LocalDateTime ldt2 = LocalDateTime.parse("2024-01-01T00:00:00");

        Articles articleOrig = Articles.builder()
                .id(67L)
                .title("Original Title")
                .url("http://original.com")
                .explanation("Original explanation")
                .email("original@example.com")
                .dateAdded(ldt1)
                .build();

        Articles articleEdited = Articles.builder()
                .id(67L)
                .title("Edited Title")
                .url("http://edited.com")
                .explanation("Edited explanation")
                .email("edited@example.com")
                .dateAdded(ldt2)
                .build();

        String requestBody = mapper.writeValueAsString(articleEdited);

        when(articlesRepository.findById(eq(67L))).thenReturn(Optional.of(articleOrig));
        when(articlesRepository.save(any(Articles.class))).thenReturn(articleEdited);

        MvcResult response = mockMvc.perform(
                put("/api/articles?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(articlesRepository, times(1)).findById(67L);
        verify(articlesRepository, times(1)).save(articleEdited);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_tries_to_edit_nonexistent_article_and_gets_error_message() throws Exception {
        when(articlesRepository.findById(eq(99L))).thenReturn(Optional.empty());

        Articles articleEdited = Articles.builder()
                .id(99L)
                .title("Nonexistent Article")
                .url("http://nonexistent.com")
                .explanation("This should not be saved")
                .email("nonexistent@example.com")
                .dateAdded(LocalDateTime.parse("2024-01-01T00:00:00"))
                .build();

        String requestBody = mapper.writeValueAsString(articleEdited);

        MvcResult response = mockMvc.perform(
                put("/api/articles?id=99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        verify(articlesRepository, times(1)).findById(99L);

        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Articles with id 99 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_tries_to_delete_nonexistent_article_and_gets_error_message() throws Exception {
        when(articlesRepository.findById(eq(15L))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(
                delete("/api/articles?id=15")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        verify(articlesRepository, times(1)).findById(15L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Articles with id 15 not found", json.get("message"));
    }
}
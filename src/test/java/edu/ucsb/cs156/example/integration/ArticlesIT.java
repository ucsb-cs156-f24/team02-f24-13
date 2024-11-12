package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticlesIT {
        @Autowired
        public CurrentUserService currentUserService;

        @Autowired
        public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        ArticlesRepository articlesRepository;

        @Autowired
        public MockMvc mockMvc;

        @Autowired
        public ObjectMapper mapper;

        @MockBean
        UserRepository userRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                // arrange

                Articles article = Articles.builder()
                                .title("Test Title")
                                .url("http://example.com")
                                .explanation("Explanation text")
                                .email("test@example.com")
                                .dateAdded(LocalDateTime.of(2024, 11, 12, 11, 47, 0))
                                .build();
                
                articlesRepository.save(article);

                // act
                MvcResult response = mockMvc.perform(get("/api/articles?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert
                Articles savedArticle = articlesRepository.findById(1L).orElseThrow();
                String expectedJson = mapper.writeValueAsString(savedArticle);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_article() throws Exception {
                // arrange
                LocalDateTime fixedDate = LocalDateTime.of(2024, 11, 12, 11, 47, 0);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/articles/post")
                                                .param("title", "Test Title")
                                                .param("url", "http://example.com")
                                                .param("explanation", "Explanation text")
                                                .param("email", "test@example.com")
                                                .param("dateAdded", "2024-11-12T11:47:00")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                Articles savedArticle = articlesRepository.findById(1L).orElseThrow();
                assertEquals("Test Title", savedArticle.getTitle());
                assertEquals("http://example.com", savedArticle.getUrl());
                assertEquals("Explanation text", savedArticle.getExplanation());
                assertEquals("test@example.com", savedArticle.getEmail());
                assertEquals(fixedDate, savedArticle.getDateAdded());
        }
}

package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_review() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Review").click();

        page.getByText("Create Menu Item Review").click();
        assertThat(page.getByText("Create New MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReviewForm-itemId").fill("1");
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("phillconrad@yahoo.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("5");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2022-01-03T00:00");
        page.getByTestId("MenuItemReviewForm-comments").fill("very nice");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail"))
                .hasText("phillconrad@yahoo.com");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-stars"))
                .hasText("5");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
                .hasText("very nice");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReviewForm-comments").fill("delicious!");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("delicious!");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
    }

}
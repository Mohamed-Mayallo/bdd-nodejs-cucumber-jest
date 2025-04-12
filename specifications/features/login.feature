@authentication
Feature: User Login
  As a registered user
  I want to login to my account
  So that I can access protected resources

  Background:
    Given the login system is available
    And I am a registered user with username "testuser" and password "testpass"

  @smoke
  Scenario: Successful login
    When I submit login with username "testuser" and password "testpass"
    Then I should receive a valid JWT token

  @regression
  Scenario Outline: Login with various credentials
    When I submit login with username "<username>" and password "<password>"
    Then I should receive "<message>"

    Examples:
      | username | password  | message |
      | testuser | testpass  | success |
      | wronguser| testpass  | Invalid credentials |
      | testuser | wrongpass | Invalid credentials |
      | ""       | testpass  | Invalid credentials |
      | testuser | ""        | Invalid credentials |

  @regression
  Scenario: Login with data table
    When I submit multiple login attempts:
      | username  | password  | expected_result |
      | testuser  | testpass  | success |
      | wronguser | wrongpass | failure |
    Then the login results should match expectations
@authentication
Feature: User Registration
  As a new user
  I want to register an account
  So that I can access the system

  Background:
    Given the registration system is available

  @smoke
  Scenario: Successful user registration
    When I submit registration with username "newuser" and password "password123"
    Then I should receive a successful registration message

  @regression
  Scenario Outline: Registration with various credentials
    When I submit registration with username "<username>" and password "<password>"
    Then I should receive "<message>"

    Examples:
      | username | password | message |
      | user1    | pass123  | User registered successfully |
      | user1    | pass123  | User already exists |
      |          | pass123  | Invalid credentials |
      | user2    |          | Invalid credentials |

  @regression
  Scenario: Registration with data table
    When I submit multiple registrations:
      | username | password |
      | user3    | pass123  |
      | user4    | pass456  |
    Then all registrations should be successful

  @regression
  Scenario: Registration with detailed response validation
    When I submit registration with username "testuser" and password "test123"
    Then I should receive a response matching:
      """
      {
        "status": 201,
        "body": {
          "message": "User registered successfully"
        }
      }
      """
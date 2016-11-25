Feature: Entry
  As a end user
  I want to create single, multiple entry and delete entry
  So that i can add and delete different hotels entry to the system

  Scenario: Create Single entry
    Given I login as "admin" and "password"
    When I enter "falaknuma" "Hyd" "nizam" "090909090909" "taj@gmail.com"
    Then I expect to see "falaknuma" in the entry list

  Scenario Outline: Create Multi entry
    Given I login as "admin" and "password"
    When I enter "<name>" "<address>" "<owner>" "<number>" "<Email>"
    Then I expect to see "<expected>" in the entry list
    Examples:
      | name    | address | owner       | number      | Email                     | expected |
      | taj     | Hyd     | taj sons    | 08989898989 | taj@customerservice.co.uk | taj      |
      | novotel | London  | novotel Ltd | 01134341245 | novotel@care.co.uk        | novotel  |

  Scenario: Delete Entry
    Given I login as "admin" and "password"
    When I delete an "falaknuma"
    Then "falaknuma" must be deleted




---
title: "Unit Testing: Principles, Practices, and Patterns"
author: Vladimir Khorikov
genre: "Science & Technology"
color: "#c9a07a"
---

## The Goal of Unit Testing: Sustainability and Scalability

The goal of unit testing is to enable sustainable growth of a software project. When you start a project there is no code to worry about, no bad decisions about the architecture have been made, but as time goes on and code gets added without **good tests** it may become harder to implement features quickly.

This is where you run in to _Software Entropy,_ which manifests itself in the form of code that tends to deteriorate, leading to increased risk each time you make changes to the project’s codebase. To overturn this you must start and project by writing **good tests**, this does require much more effort at the start of the project, but leads to a significant increase in developer productivity down the line as you lower the amount of regressions that could occur.

### Regression

> A _Regression_ is when a feature stops working as intended after a certain event. The terms _regression_ and _software bug_ are synonymous and can be used interchangeably.

### What Makes a Good Test?

A good test has high value and low upkeep cost, determined by the time spent on the activities listed below:

- Refactoring the test when you refactor the underlying code
- Running the test on each code change
- Dealing with false alarms raised by the test
- Spending time reading the test when you’re trying to understand how the underlying code behaves.

### The Four Pillars of a Good Unit Test

The four pillars of unit testing can help to analyze any automated tests your software project may have: unit tests, integration tests, or end-to-end tests.

1. Protection against regressions
   - Writing tests against your code that protect against software bugs means accounting for the amount of code executed by the test, the complexity of that code and the code’s domain significance. **Good Tests** should exercise as much code as possible.
2. Resistance to refactoring
   - A test that can withstand changes to the underlying codebase without failing has a high resistance to refactoring. But, what you want to avoid is false positives in your code. False positives are caused by tests that are to tightly coupled to the implementation details of the System Under Test (SUT). **Good Tests** are loosely coupled to the System Under Test’s implementation details.
3. _Fast_ Feedback
   - Slow tests delay feedback and prolong the period during which bugs may be found, they discourage developers from running tests often and increase the cost of eventually fixing those bugs. **Good tests** are fast, meaning you can test for more things and run them often.
4. Maintainability
   - The maintainability of a test depends on two metrics: Can other developers read and understand what the test is for and Can other developers run the test easily. **Good Tests** are treated as first-class citizens and have few dependencies in order to be run.

#### The Intrinsic Connection Between Attributes One and Two

The attributes of protection against regressions and resistance to refactoring are combined in an effort to reduce the probability of false positives and false negatives. The lower the probability of those two outcomes the higher the accuracy of your tests.

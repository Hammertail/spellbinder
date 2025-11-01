# Contributing to Spellbinder 🪄

First off, thank you for considering contributing to Spellbinder! It's people like you that make open-source software such a powerful force for innovation.

This document provides guidelines for contributing to the project. Please feel free to propose changes to this document in a pull request.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before you start contributing.

## How Can I Contribute?

There are many ways to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests, or writing code which can be incorporated into Spellbinder itself.

### Reporting Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/Hammertail/spellbinder/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/Hammertail/spellbinder/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- We welcome suggestions for new features or enhancements. Please open an issue with the `enhancement` label.
- Clearly describe the proposed enhancement and the problem it solves. Explain why this enhancement would be useful to Spellbinder users.

### Pull Request Process

1.  **Fork the repository** and create your branch from `main`.
2.  **Set up your development environment** (see below).
3.  **Make your changes**. Add or update tests as appropriate.
4.  **Ensure the test suite passes** (`pytest`).
5.  **Format your code** using a tool like `black` or `ruff` to maintain consistent style.
6.  **Issue that pull request!**

## Development Setup

Here’s how to set up `spellbinder` for local development.

1.  **Fork** the `spellbinder` repository on GitHub.

2.  **Clone your fork** locally:

    ```bash
    git clone https://github.com/YOUR_USERNAME/spellbinder.git
    cd spellbinder
    ```

3.  **Create a virtual environment** and activate it:

    ```bash
    # Using venv
    python -m venv .venv
    source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
    ```

4.  **Install dependencies**, including development requirements:

    ```bash
    # Install main and test dependencies
    pip install -r requirements.txt
    pip install -e .[dev]  # Or install test dependencies separately
    ```

5.  **Create a branch** for your local development:

    ```bash
    git checkout -b name-of-your-bugfix-or-feature
    ```

    Now you can make your changes locally!

6.  **Run tests** to ensure everything is working correctly:

    ```bash
    pytest
    ```

7.  When you're done making changes, commit your changes and push your branch to GitHub:

    ```bash
    git add .
    git commit -m "Your detailed description of your changes."
    git push origin name-of-your-bugfix-or-feature
    ```

8.  **Submit a pull request** through the GitHub website.

## Coding Style

- We follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for all Python code.
- We use `black` and `ruff` for automated code formatting and linting. Please run these tools on your code before submitting a pull request.
- Docstrings should follow the [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html#3.8-comments-and-docstrings).

## Acknowledgment

We are inspired by the work of other open-source projects in this space, such as [Open-Interface](https://github.com/AmberSahdev/Open-Interface) and [ScreenAgent](https://github.com/niuzaisheng/ScreenAgent). Thank you for being part of our community!

---

# Spellbinder 🪄

**Control your computer with the power of Vision Language Models.**

---

![Spellbinder Demo](https://raw.githubusercontent.com/Hammertail/spellbinder/main/assets/spellbinder_demo.gif)

*A quick demonstration of Spellbinder ordering a pizza.*

---

`Spellbinder` is an open-source Python project that allows a Large Language Model (LLM) with vision capabilities to observe your screen and control your computer to achieve a given goal. It's a powerful, experimental tool that brings the concept of a real-world AI assistant to life.

Based on a simple yet robust **Observe → Think → Act** loop, Spellbinder can perform a wide range of tasks, from simple calculations to complex web navigation, all guided by natural language.

## ✨ Key Features

-   **Natural Language Control**: Give commands in plain English (e.g., "*Search for the best local pizza places*").
-   **Vision-Powered**: Uses modern Vision Language Models (VLMs) like GPT-4o to understand what's on your screen.
-   **Cross-Platform**: Runs on Windows, macOS, and Linux.
-   **Modular Architecture**: Easy to understand, maintain, and extend.
-   **CLI & Programmatic Use**: Use it directly from your terminal or integrate it into your own Python scripts.
-   **Safety First**: Includes a failsafe mechanism—just move your mouse to any corner of the screen to stop execution immediately.
-   **Extensible**: Designed to support different LLMs and new actions.

## ⚙️ How It Works

Spellbinder operates on a continuous loop that mimics human interaction with a computer:

1.  **👁️ Observe**: The agent takes a screenshot of the current screen.
2.  **🧠 Think**: The screenshot, along with the user's goal and the history of previous actions, is sent to a Vision Language Model. The LLM analyzes the visual context and decides the next best action to take, returning it as a structured JSON command.
3.  **⚡ Act**: The agent's `ActionController` interprets the command from the LLM and executes it by controlling the mouse and keyboard.

This cycle repeats, allowing Spellbinder to perform complex, multi-step tasks and adapt to changes on the screen.

![Spellbinder Architecture](https://raw.githubusercontent.com/Hammertail/spellbinder/main/assets/spellbinder_architecture.png)

## 🚀 Getting Started

### Prerequisites

-   Python 3.11+
-   A graphical desktop environment (the agent needs a screen to see!)

### 1. Installation

You can install Spellbinder directly from this repository.

```bash
# Clone the repository
git clone https://github.com/Hammertail/spellbinder.git

# Navigate to the project directory
cd spellbinder

# Install the package in editable mode
pip install -e .
```

### 2. Configuration

Spellbinder requires an API key for a Vision Language Model. Currently, it's optimized for OpenAI's GPT-4o.

1.  **Get an API Key**: Obtain an API key from [OpenAI](https://platform.openai.com/api-keys).
2.  **Set the Environment Variable**: Set the key in your environment. This is the most secure way to handle your key.

    ```bash
    # On macOS/Linux
    export OPENAI_API_KEY="your-openai-api-key-here"

    # On Windows (Command Prompt)
    set OPENAI_API_KEY="your-openai-api-key-here"
    ```

    Alternatively, you can create a `.env` file in the project root and add the key there:

    ```
    # .env
    OPENAI_API_KEY="your-openai-api-key-here"
    ```

## 🕹️ Usage

### Command-Line Interface (CLI)

The easiest way to use Spellbinder is through its command-line interface.

```bash
# Run the agent with a specific goal
spellbinder run "Open the calculator and calculate 123 times 456"

# Get information about the agent and your system
spellbinder info

# Take a quick screenshot
spellbinder screenshot my_screen.png
```

Here's an example of the output you can expect:

```
$ spellbinder run "Find the current weather in London"

Iteration 1/20
📸 Capturing screenshot...
🤔 Consulting LLM...

💭 Thought
I need to open a web browser to search for the weather. I will start by looking for a browser icon on the desktop or in the taskbar.

⚡ Executing action...
Clicking at (85, 520) with left button, 2 time(s)

...
```

### Programmatic Use

You can also import and use Spellbinder in your own Python projects.

```python
# examples/simple_example.py

import os
from spellbinder import SpellbinderAgent, SpellbinderConfig

def main():
    # Ensure your API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("Error: Please set the OPENAI_API_KEY environment variable.")
        return

    # Create a configuration (or use defaults)
    config = SpellbinderConfig.from_env()
    config.llm.model = "gpt-4o"

    # Initialize the agent
    agent = SpellbinderAgent(config)

    # Define the goal
    goal = "Create a new folder on the desktop named 'AI Projects'"

    # Run the agent
    success = agent.run(goal)

    if success:
        print("✅ Goal accomplished!")
    else:
        print("❌ Could not complete the goal.")

if __name__ == "__main__":
    main()
```

## ⚠️ Disclaimer

Spellbinder is an experimental project. It directly controls your computer, including your mouse and keyboard. While it includes safety features, you should **always supervise the agent** while it is running.

-   **Failsafe**: To stop the agent at any time, forcefully move your mouse cursor to any of the four corners of your primary screen.
-   **Supervision**: Do not leave the agent unattended, especially on systems with sensitive information.

Use this software responsibly.

## 🤝 Contributing

Contributions are welcome! Whether it's adding new features, improving the documentation, or reporting bugs, your help is appreciated. Please check out our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ by the Manus team and open-source contributors.*

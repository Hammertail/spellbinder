"""
Simple example of using Spellbinder programmatically.
"""

import os
from spellbinder import SpellbinderAgent, SpellbinderConfig

def main():
    # Make sure you have set your OpenAI API key
    # export OPENAI_API_KEY='your-key-here'
    
    if not os.getenv("OPENAI_API_KEY"):
        print("Error: Please set OPENAI_API_KEY environment variable")
        return
    
    # Create configuration
    config = SpellbinderConfig.from_env()
    config.llm.model = "gpt-4o"
    config.agent.max_iterations = 10
    config.agent.verbose = True
    
    # Create agent
    agent = SpellbinderAgent(config)
    
    # Define your goal
    goal = "Open the calculator application"
    
    # Run the agent
    print(f"Starting Spellbinder with goal: {goal}")
    success = agent.run(goal)
    
    if success:
        print("✅ Goal accomplished!")
    else:
        print("❌ Could not complete the goal")

if __name__ == "__main__":
    main()

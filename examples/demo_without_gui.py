"""
Demo script that shows Spellbinder's components without requiring GUI.
This is useful for testing in headless environments.
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from spellbinder.config import SpellbinderConfig, LLMConfig, AgentConfig
from spellbinder.vision import VisionCore
from spellbinder.llm import LLMInterface

def demo_config():
    """Demonstrate configuration management."""
    print("=" * 60)
    print("DEMO: Configuration Management")
    print("=" * 60)
    
    # Create default config
    config = SpellbinderConfig()
    print(f"\nDefault LLM Model: {config.llm.model}")
    print(f"Default Max Iterations: {config.agent.max_iterations}")
    print(f"Screenshot Quality: {config.agent.screenshot_quality}")
    
    # Create custom config
    custom_llm = LLMConfig(
        provider="openai",
        model="gpt-4o-mini",
        max_tokens=500
    )
    custom_agent = AgentConfig(
        max_iterations=10,
        verbose=True
    )
    custom_config = SpellbinderConfig(llm=custom_llm, agent=custom_agent)
    
    print(f"\nCustom LLM Model: {custom_config.llm.model}")
    print(f"Custom Max Iterations: {custom_config.agent.max_iterations}")
    
    print("\n✅ Configuration demo completed\n")


def demo_llm_interface():
    """Demonstrate LLM interface (without actual API call)."""
    print("=" * 60)
    print("DEMO: LLM Interface")
    print("=" * 60)
    
    config = LLMConfig(
        provider="openai",
        model="gpt-4o",
        api_key="dummy-key-for-demo"
    )
    
    llm = LLMInterface(config)
    
    print(f"\nLLM Provider: {llm.config.provider}")
    print(f"LLM Model: {llm.config.model}")
    print(f"Max Tokens: {llm.config.max_tokens}")
    print(f"Temperature: {llm.config.temperature}")
    
    print("\nSystem Prompt Preview:")
    print("-" * 60)
    print(llm.SYSTEM_PROMPT[:300] + "...")
    print("-" * 60)
    
    print("\n✅ LLM interface demo completed\n")


def demo_vision_core():
    """Demonstrate vision core (screenshot capability check)."""
    print("=" * 60)
    print("DEMO: Vision Core")
    print("=" * 60)
    
    try:
        vision = VisionCore(quality=85)
        print("\n✅ Vision Core initialized successfully")
        print(f"Screenshot Quality: {vision.quality}")
        
        # Note: We can't actually capture screenshots in headless mode
        print("\n⚠️  Screenshot capture requires a graphical environment")
        print("   In a real environment, this would capture your screen")
        
    except Exception as e:
        print(f"\n❌ Vision Core error: {e}")
    
    print("\n✅ Vision core demo completed\n")


def demo_action_types():
    """Demonstrate available action types."""
    print("=" * 60)
    print("DEMO: Available Actions")
    print("=" * 60)
    
    actions = {
        "click": {
            "description": "Click at coordinates",
            "parameters": {"x": "int", "y": "int", "button": "left|right", "clicks": "1|2"}
        },
        "type": {
            "description": "Type text",
            "parameters": {"text": "string"}
        },
        "hotkey": {
            "description": "Press key combination",
            "parameters": {"keys": ["ctrl", "c"]}
        },
        "scroll": {
            "description": "Scroll mouse wheel",
            "parameters": {"clicks": "int (positive=up, negative=down)"}
        },
        "move": {
            "description": "Move mouse",
            "parameters": {"x": "int", "y": "int"}
        },
        "wait": {
            "description": "Wait for duration",
            "parameters": {"seconds": "float"}
        },
        "done": {
            "description": "Mark task as completed",
            "parameters": {"message": "string"}
        }
    }
    
    print("\nSpellbinder supports the following actions:\n")
    for action_name, action_info in actions.items():
        print(f"  • {action_name:10} - {action_info['description']}")
        print(f"    Parameters: {action_info['parameters']}")
        print()
    
    print("✅ Actions demo completed\n")


def main():
    """Run all demos."""
    print("\n" + "=" * 60)
    print("  SPELLBINDER - Component Demonstration")
    print("  (Headless Mode - No GUI Required)")
    print("=" * 60 + "\n")
    
    demo_config()
    demo_llm_interface()
    demo_vision_core()
    demo_action_types()
    
    print("=" * 60)
    print("  All demos completed successfully!")
    print("=" * 60)
    print("\nNote: To use Spellbinder fully, you need:")
    print("  1. A graphical environment (X11, Wayland, etc.)")
    print("  2. OpenAI API key set in environment")
    print("  3. Run: spellbinder run 'your goal here'")
    print()


if __name__ == "__main__":
    main()

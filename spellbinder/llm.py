"""
LLM Interface - Communication with Vision Language Models.
"""

import json
from typing import Dict, Any, Optional
from openai import OpenAI
from .config import LLMConfig


class LLMInterface:
    """Interface for communicating with LLM APIs."""
    
    SYSTEM_PROMPT = """You are a computer control agent. Your task is to help users accomplish their goals by controlling the computer.

You will receive:
1. A screenshot of the current screen (as an image)
2. The user's goal
3. History of previous actions (if any)

You must analyze the screen and decide the next action to take. Respond with a JSON object containing:

{
    "thought": "Your reasoning about what you see and what to do next",
    "action": "click|type|hotkey|scroll|move|wait|done",
    "parameters": {
        // Action-specific parameters
    },
    "completed": false  // Set to true only when the goal is fully accomplished
}

Available actions:
- click: Click at coordinates {"x": int, "y": int, "button": "left|right", "clicks": 1|2}
- type: Type text {"text": "string to type"}
- hotkey: Press key combination {"keys": ["ctrl", "c"]}
- scroll: Scroll {"clicks": int}  // positive = up, negative = down
- move: Move mouse {"x": int, "y": int}
- wait: Wait {"seconds": float}
- done: Task completed {"message": "completion message"}

Important guidelines:
- Analyze the screen carefully before deciding
- Use precise coordinates for clicks
- Break complex tasks into simple steps
- If you're unsure, explain your reasoning in "thought"
- Set "completed": true only when the goal is fully achieved
"""
    
    def __init__(self, config: LLMConfig):
        """
        Initialize LLM Interface.
        
        Args:
            config: LLM configuration
        """
        self.config = config
        self.client = self._create_client()
    
    def _create_client(self) -> OpenAI:
        """Create OpenAI client based on configuration."""
        kwargs = {}
        
        if self.config.api_key:
            kwargs["api_key"] = self.config.api_key
        
        if self.config.base_url:
            kwargs["base_url"] = self.config.base_url
        
        return OpenAI(**kwargs)
    
    def get_next_action(
        self,
        screenshot_base64: str,
        goal: str,
        history: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Get the next action from the LLM.
        
        Args:
            screenshot_base64: Base64 encoded screenshot
            goal: User's goal
            history: List of previous actions
        
        Returns:
            Dictionary containing the action to take
        """
        # Build the user message
        user_message = f"Goal: {goal}\n\n"
        
        if history:
            user_message += "Previous actions:\n"
            for i, action in enumerate(history[-5:], 1):  # Last 5 actions
                user_message += f"{i}. {action.get('action', 'unknown')}"
                if 'thought' in action:
                    user_message += f" - {action['thought'][:100]}"
                user_message += "\n"
            user_message += "\n"
        
        user_message += "What should I do next? Respond with JSON only."
        
        # Create the messages for the API
        messages = [
            {
                "role": "system",
                "content": self.SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_message
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{screenshot_base64}"
                        }
                    }
                ]
            }
        ]
        
        # Call the API
        response = self.client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            max_tokens=self.config.max_tokens,
            temperature=self.config.temperature
        )
        
        # Extract and parse the response
        content = response.choices[0].message.content
        
        # Try to extract JSON from the response
        try:
            # Sometimes LLMs wrap JSON in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            action_data = json.loads(content)
            return action_data
        except json.JSONDecodeError as e:
            # If parsing fails, return an error action
            return {
                "thought": f"Failed to parse LLM response: {e}",
                "action": "wait",
                "parameters": {"seconds": 1},
                "completed": False,
                "raw_response": content
            }

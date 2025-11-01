"""
Action Controller - Execute mouse and keyboard actions.
"""

import time
from typing import List, Tuple, Optional
from enum import Enum

try:
    import pyautogui
    PYAUTOGUI_AVAILABLE = True
except (ImportError, KeyError, Exception) as e:
    PYAUTOGUI_AVAILABLE = False
    print(f"Warning: PyAutoGUI not available: {e}")


class MouseButton(str, Enum):
    """Mouse button types."""
    LEFT = "left"
    RIGHT = "right"
    MIDDLE = "middle"


class ActionController:
    """Controls mouse and keyboard interactions."""
    
    def __init__(self, safety_delay: float = 0.1):
        """
        Initialize Action Controller.
        
        Args:
            safety_delay: Delay between actions for safety
        """
        self.safety_delay = safety_delay
        
        if not PYAUTOGUI_AVAILABLE:
            raise RuntimeError(
                "PyAutoGUI is not available. This is likely because:\n"
                "1. No display server is running (headless environment)\n"
                "2. DISPLAY environment variable is not set\n"
                "3. X11 is not properly configured\n\n"
                "Spellbinder requires a graphical environment to control the computer."
            )
        
        # Configure PyAutoGUI
        pyautogui.PAUSE = safety_delay
        pyautogui.FAILSAFE = True  # Move mouse to corner to abort
    
    def move_mouse(self, x: int, y: int, duration: float = 0.5) -> None:
        """
        Move mouse to coordinates.
        
        Args:
            x: X coordinate
            y: Y coordinate
            duration: Time to complete the movement
        """
        pyautogui.moveTo(x, y, duration=duration)
    
    def click(
        self, 
        x: Optional[int] = None, 
        y: Optional[int] = None,
        button: MouseButton = MouseButton.LEFT,
        clicks: int = 1
    ) -> None:
        """
        Click at coordinates or current position.
        
        Args:
            x: X coordinate (None for current position)
            y: Y coordinate (None for current position)
            button: Mouse button to click
            clicks: Number of clicks (2 for double-click)
        """
        if x is not None and y is not None:
            pyautogui.click(x, y, clicks=clicks, button=button.value)
        else:
            pyautogui.click(clicks=clicks, button=button.value)
    
    def double_click(self, x: Optional[int] = None, y: Optional[int] = None) -> None:
        """
        Double-click at coordinates or current position.
        
        Args:
            x: X coordinate (None for current position)
            y: Y coordinate (None for current position)
        """
        self.click(x, y, clicks=2)
    
    def right_click(self, x: Optional[int] = None, y: Optional[int] = None) -> None:
        """
        Right-click at coordinates or current position.
        
        Args:
            x: X coordinate (None for current position)
            y: Y coordinate (None for current position)
        """
        self.click(x, y, button=MouseButton.RIGHT)
    
    def scroll(self, clicks: int) -> None:
        """
        Scroll the mouse wheel.
        
        Args:
            clicks: Number of scroll clicks (positive = up, negative = down)
        """
        pyautogui.scroll(clicks)
    
    def type_text(self, text: str, interval: float = 0.05) -> None:
        """
        Type text character by character.
        
        Args:
            text: Text to type
            interval: Delay between keystrokes
        """
        pyautogui.write(text, interval=interval)
    
    def press_key(self, key: str) -> None:
        """
        Press a single key.
        
        Args:
            key: Key name (e.g., 'enter', 'esc', 'tab')
        """
        pyautogui.press(key)
    
    def hotkey(self, *keys: str) -> None:
        """
        Press a combination of keys.
        
        Args:
            keys: Keys to press together (e.g., 'ctrl', 'c')
        """
        pyautogui.hotkey(*keys)
    
    def get_mouse_position(self) -> Tuple[int, int]:
        """
        Get current mouse position.
        
        Returns:
            Tuple of (x, y) coordinates
        """
        return pyautogui.position()
    
    def wait(self, seconds: float) -> None:
        """
        Wait for a specified duration.
        
        Args:
            seconds: Time to wait in seconds
        """
        time.sleep(seconds)

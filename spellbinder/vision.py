"""
Vision Core - Screenshot capture and image processing.
"""

import io
import base64
from typing import Tuple
from PIL import ImageGrab, Image


class VisionCore:
    """Handles screen capture and image processing."""
    
    def __init__(self, quality: int = 85):
        """
        Initialize Vision Core.
        
        Args:
            quality: JPEG quality for compression (1-100)
        """
        self.quality = quality
    
    def capture_screen(self) -> Image.Image:
        """
        Capture the entire screen.
        
        Returns:
            PIL Image object of the screen
        """
        screenshot = ImageGrab.grab()
        return screenshot
    
    def get_screen_size(self) -> Tuple[int, int]:
        """
        Get the screen dimensions.
        
        Returns:
            Tuple of (width, height)
        """
        screenshot = self.capture_screen()
        return screenshot.size
    
    def image_to_base64(self, image: Image.Image) -> str:
        """
        Convert PIL Image to base64 string.
        
        Args:
            image: PIL Image object
        
        Returns:
            Base64 encoded string
        """
        buffered = io.BytesIO()
        # Convert to RGB if necessary (removes alpha channel)
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        
        image.save(buffered, format="JPEG", quality=self.quality)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    
    def capture_and_encode(self) -> str:
        """
        Capture screen and return as base64 string.
        
        Returns:
            Base64 encoded screenshot
        """
        screenshot = self.capture_screen()
        return self.image_to_base64(screenshot)
    
    def save_screenshot(self, filepath: str) -> None:
        """
        Capture and save screenshot to file.
        
        Args:
            filepath: Path to save the screenshot
        """
        screenshot = self.capture_screen()
        screenshot.save(filepath)

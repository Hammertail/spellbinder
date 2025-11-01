"""
Configuration management for Spellbinder using Pydantic.
"""

import os
from typing import Literal, Optional
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings


class LLMConfig(BaseModel):
    """Configuration for LLM provider."""
    
    provider: Literal["openai", "gemini", "custom"] = "openai"
    model: str = "gpt-4o"
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    max_tokens: int = 1000
    temperature: float = 0.7


class AgentConfig(BaseModel):
    """Configuration for agent behavior."""
    
    max_iterations: int = Field(default=20, description="Maximum number of action iterations")
    screenshot_quality: int = Field(default=85, description="JPEG quality for screenshots (1-100)")
    delay_between_actions: float = Field(default=1.0, description="Delay in seconds between actions")
    verbose: bool = Field(default=True, description="Enable verbose logging")


class SpellbinderConfig(BaseSettings):
    """Main configuration class for Spellbinder."""
    
    llm: LLMConfig = Field(default_factory=LLMConfig)
    agent: AgentConfig = Field(default_factory=AgentConfig)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"
    
    @classmethod
    def from_env(cls) -> "SpellbinderConfig":
        """Load configuration from environment variables."""
        config = cls()
        
        # Override with environment variables if present
        if api_key := os.getenv("OPENAI_API_KEY"):
            config.llm.api_key = api_key
        
        if model := os.getenv("SPELLBINDER_MODEL"):
            config.llm.model = model
        
        if provider := os.getenv("SPELLBINDER_PROVIDER"):
            config.llm.provider = provider
        
        return config

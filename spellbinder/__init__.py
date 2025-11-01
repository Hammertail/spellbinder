"""
Spellbinder - LLM-Powered Computer Control Agent

A powerful open-source agent that uses Large Language Models
to control your computer through vision and action.
"""

__version__ = "0.1.0"
__author__ = "Spellbinder Contributors"
__license__ = "MIT"

from .agent import SpellbinderAgent
from .config import SpellbinderConfig

__all__ = ["SpellbinderAgent", "SpellbinderConfig"]

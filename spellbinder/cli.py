"""
Command-line interface for Spellbinder.
"""

import os
import sys
import click
from rich.console import Console
from rich.panel import Panel

from . import __version__
from .agent import SpellbinderAgent
from .config import SpellbinderConfig


console = Console()


@click.group()
@click.version_option(version=__version__)
def cli():
    """
    Spellbinder - LLM-Powered Computer Control Agent
    
    Control your computer using natural language and AI vision.
    """
    pass


@cli.command()
@click.argument('goal', required=True)
@click.option('--max-iterations', '-m', default=20, help='Maximum number of iterations')
@click.option('--model', default='gpt-4o', help='LLM model to use')
@click.option('--api-key', envvar='OPENAI_API_KEY', help='OpenAI API key')
@click.option('--verbose/--quiet', default=True, help='Enable verbose output')
def run(goal: str, max_iterations: int, model: str, api_key: str, verbose: bool):
    """
    Run Spellbinder to accomplish a goal.
    
    Example:
        spellbinder run "Open the browser and search for Python tutorials"
    """
    # Check for API key
    if not api_key:
        console.print(Panel(
            "[red]Error: OpenAI API key not found![/red]\n\n"
            "Please set the OPENAI_API_KEY environment variable:\n"
            "  export OPENAI_API_KEY='your-api-key-here'\n\n"
            "Or pass it with --api-key option",
            border_style="red"
        ))
        sys.exit(1)
    
    # Create configuration
    config = SpellbinderConfig.from_env()
    config.llm.api_key = api_key
    config.llm.model = model
    config.agent.max_iterations = max_iterations
    config.agent.verbose = verbose
    
    # Create and run agent
    try:
        agent = SpellbinderAgent(config)
        success = agent.run(goal)
        
        if success:
            console.print("\n[bold green]✨ Mission accomplished![/bold green]")
            sys.exit(0)
        else:
            console.print("\n[bold yellow]⚠️  Could not complete the goal[/bold yellow]")
            sys.exit(1)
    
    except Exception as e:
        console.print(f"\n[bold red]Error: {e}[/bold red]")
        sys.exit(1)


@cli.command()
def info():
    """Display information about Spellbinder and system."""
    from .vision import VisionCore
    
    vision = VisionCore()
    screen_size = vision.get_screen_size()
    
    info_text = f"""
[bold cyan]Spellbinder v{__version__}[/bold cyan]

[yellow]System Information:[/yellow]
  Screen Size: {screen_size[0]}x{screen_size[1]}
  Python: {sys.version.split()[0]}
  Platform: {sys.platform}

[yellow]Configuration:[/yellow]
  API Key: {'✓ Set' if os.getenv('OPENAI_API_KEY') else '✗ Not set'}
  
[yellow]Available Models:[/yellow]
  - gpt-4o (recommended)
  - gpt-4o-mini
  - gpt-4-turbo
  - gemini-2.5-flash (with custom setup)

[yellow]Quick Start:[/yellow]
  1. Set your API key: export OPENAI_API_KEY='your-key'
  2. Run: spellbinder run "your goal here"
  
[yellow]Examples:[/yellow]
  spellbinder run "Open calculator and compute 15 * 23"
  spellbinder run "Create a new text file called notes.txt"
  spellbinder run "Search for weather in New York"
"""
    
    console.print(Panel(info_text, border_style="cyan"))


@cli.command()
@click.argument('filepath', type=click.Path())
def screenshot(filepath: str):
    """Take a screenshot and save it to a file."""
    from .vision import VisionCore
    
    vision = VisionCore()
    
    try:
        vision.save_screenshot(filepath)
        console.print(f"[green]✓[/green] Screenshot saved to: {filepath}")
    except Exception as e:
        console.print(f"[red]Error saving screenshot: {e}[/red]")
        sys.exit(1)


if __name__ == '__main__':
    cli()

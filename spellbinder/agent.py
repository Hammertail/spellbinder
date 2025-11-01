"""
Spellbinder Agent - Main orchestrator for computer control.
"""

import time
from typing import List, Dict, Any, Optional
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

from .config import SpellbinderConfig
from .vision import VisionCore
from .llm import LLMInterface
from .controller import ActionController


class SpellbinderAgent:
    """Main agent class that orchestrates the observe-think-act loop."""
    
    def __init__(self, config: Optional[SpellbinderConfig] = None):
        """
        Initialize Spellbinder Agent.
        
        Args:
            config: Configuration object (uses defaults if None)
        """
        self.config = config or SpellbinderConfig.from_env()
        self.console = Console()
        
        # Initialize components
        self.vision = VisionCore(quality=self.config.agent.screenshot_quality)
        self.llm = LLMInterface(config=self.config.llm)
        self.controller = ActionController(safety_delay=self.config.agent.delay_between_actions)
        
        # State tracking
        self.history: List[Dict[str, Any]] = []
        self.goal: Optional[str] = None
    
    def _log(self, message: str, style: str = "blue") -> None:
        """Log a message if verbose mode is enabled."""
        if self.config.agent.verbose:
            self.console.print(f"[{style}]{message}[/{style}]")
    
    def _execute_action(self, action_data: Dict[str, Any]) -> bool:
        """
        Execute an action based on LLM response.
        
        Args:
            action_data: Action dictionary from LLM
        
        Returns:
            True if action was executed successfully
        """
        action = action_data.get("action", "").lower()
        params = action_data.get("parameters", {})
        
        try:
            if action == "click":
                x = params.get("x")
                y = params.get("y")
                button = params.get("button", "left")
                clicks = params.get("clicks", 1)
                
                self._log(f"Clicking at ({x}, {y}) with {button} button, {clicks} time(s)")
                
                if button == "left":
                    self.controller.click(x, y, clicks=clicks)
                elif button == "right":
                    self.controller.right_click(x, y)
            
            elif action == "type":
                text = params.get("text", "")
                self._log(f"Typing: {text[:50]}...")
                self.controller.type_text(text)
            
            elif action == "hotkey":
                keys = params.get("keys", [])
                self._log(f"Pressing hotkey: {'+'.join(keys)}")
                self.controller.hotkey(*keys)
            
            elif action == "scroll":
                clicks = params.get("clicks", 0)
                direction = "up" if clicks > 0 else "down"
                self._log(f"Scrolling {direction} ({abs(clicks)} clicks)")
                self.controller.scroll(clicks)
            
            elif action == "move":
                x = params.get("x")
                y = params.get("y")
                self._log(f"Moving mouse to ({x}, {y})")
                self.controller.move_mouse(x, y)
            
            elif action == "wait":
                seconds = params.get("seconds", 1.0)
                self._log(f"Waiting {seconds} seconds")
                self.controller.wait(seconds)
            
            elif action == "done":
                message = params.get("message", "Task completed")
                self._log(f"Task completed: {message}", style="green")
                return True
            
            else:
                self._log(f"Unknown action: {action}", style="yellow")
                return False
            
            return True
        
        except Exception as e:
            self._log(f"Error executing action: {e}", style="red")
            return False
    
    def run(self, goal: str, max_iterations: Optional[int] = None) -> bool:
        """
        Run the agent to accomplish a goal.
        
        Args:
            goal: The goal to accomplish
            max_iterations: Maximum number of iterations (uses config if None)
        
        Returns:
            True if goal was accomplished, False otherwise
        """
        self.goal = goal
        self.history = []
        
        max_iter = max_iterations or self.config.agent.max_iterations
        
        # Display welcome message
        self.console.print(Panel.fit(
            f"[bold cyan]Spellbinder Agent[/bold cyan]\n\n"
            f"Goal: [yellow]{goal}[/yellow]\n"
            f"Max iterations: {max_iter}",
            border_style="cyan"
        ))
        
        for iteration in range(1, max_iter + 1):
            self.console.print(f"\n[bold]Iteration {iteration}/{max_iter}[/bold]")
            
            try:
                # 1. OBSERVE: Capture screenshot
                self._log("📸 Capturing screenshot...")
                screenshot_b64 = self.vision.capture_and_encode()
                
                # 2. THINK: Get next action from LLM
                self._log("🤔 Consulting LLM...")
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    console=self.console,
                    transient=True
                ) as progress:
                    progress.add_task("Thinking...", total=None)
                    action_data = self.llm.get_next_action(
                        screenshot_base64=screenshot_b64,
                        goal=self.goal,
                        history=self.history
                    )
                
                # Display thought process
                thought = action_data.get("thought", "No thought provided")
                self.console.print(Panel(
                    f"[italic]{thought}[/italic]",
                    title="💭 Thought",
                    border_style="yellow"
                ))
                
                # Check if task is completed
                if action_data.get("completed", False):
                    self.console.print("\n[bold green]✅ Goal accomplished![/bold green]")
                    return True
                
                # 3. ACT: Execute the action
                self._log("⚡ Executing action...")
                success = self._execute_action(action_data)
                
                # Record in history
                self.history.append(action_data)
                
                if not success and action_data.get("action") == "done":
                    return True
                
                # Wait before next iteration
                time.sleep(self.config.agent.delay_between_actions)
            
            except KeyboardInterrupt:
                self.console.print("\n[yellow]⚠️  Interrupted by user[/yellow]")
                return False
            
            except Exception as e:
                self._log(f"Error in iteration {iteration}: {e}", style="red")
                self.console.print(f"[red]Error: {e}[/red]")
                continue
        
        self.console.print("\n[red]❌ Max iterations reached without completing goal[/red]")
        return False
    
    def get_screen_size(self):
        """Get the current screen dimensions."""
        return self.vision.get_screen_size()

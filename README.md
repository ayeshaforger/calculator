# Calculator

A clean, minimal calculator built with HTML, CSS, and JavaScript.

## Features

- Basic arithmetic operations — addition, subtraction, multiplication, division
- Keyboard support — use your keyboard to type numbers and operators
- Backspace support — delete the last digit without clearing everything
- Floating point handling — results are rounded to avoid JS precision errors
- Division by zero protection — displays an error instead of crashing
- Input length limit — prevents overflow on the display

## Tech Stack

- HTML
- CSS
- JavaScript

## What I Learned

This is my first project. It took real effort and a lot of iteration to get right. Along the way I learned:

- Separating structure, style, and behavior into three files
- Managing application state with a single state object
- Event delegation — one listener handling all button clicks
- Why `eval()` is dangerous and how to replace it with explicit logic
- Handling edge cases like division by zero and floating point errors

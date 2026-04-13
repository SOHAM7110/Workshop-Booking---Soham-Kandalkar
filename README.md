### Project Overview :

This project focuses on improving the UI/UX of the existing workshop booking website.
The goal was to enhance visual design, responsiveness, performance, and usability, especially for students accessing the platform on mobile devices.

The core functionality of the original website was preserved while improving the overall user experience.


- What design principles guided your
  improvements?

Ans - I tried using a single color scheme so that the website looks consistent and uniform
      I created colored headers, section titles with a side color bar and colored table headers
      The colors used have meaning i.e. Green for success, Amber for pending, Blue for actions and            indigo for details
  
- How did you ensure responsiveness across
  devices?

Ans - the website adjusts well to diffrent screen sizes. The navbar changes into hamburger manue on           small screens using a media query, the tables scroll horizontally instead of breaking layout            (overflowX: auto), filter sidebar wraps and stacks vertically on smaller screens and 
      profile grid automatically adjusts because it uses percentage-based widths.

- What trade-offs did you make between the
  design and performance?

Ans - profile grid automatically adjusts because it uses percentage-based widths, 
      effects are handled using direct DOM changes, instead of React state, 
      which improves performance but is less "React-style". All components are kept in 
      one file for simplicity, though this is not ideal for larger projects
      
- What was the most challenging part of the
  task and how did you approach it?

Ans - the hardest part in this project was to get myself fimiliar with React Js and how does it
      the whole react Js framework works with Django Framework. I had to watch a Tutorials from            Youtube and use gpt for fixing my code and get suggestions on areas of improvements

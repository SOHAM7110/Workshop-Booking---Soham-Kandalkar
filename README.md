### Project Overview :

This project focuses on improving the UI/UX of the existing workshop booking website.
The goal was to enhance visual design, responsiveness, performance, and usability, especially for students accessing the platform on mobile devices.

The core functionality of the original website was preserved while improving the overall user experience.

### Reasoning :

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

### Features and Imporvements :

- Modern and clean user interface
- Improved navigation and readability
- Mobile-first responsive design
- Better visual hierarchy using colors and layout
- Smooth hover interactions
- Optimized performance (reduced unnecessary re-renders)
- Horizontally scrollable tables for small screens


### Tech Stack :

- Tech Stack
- React.js
- JavaScript (ES6)
- HTML5
- CSS (Inline Styling)

### Visual Showcase :

- Before
  
  sign in page :
  <img width="1919" height="1035" alt="image" src="https://github.com/user-attachments/assets/5edbb12a-5f22-4a0e-b938-d883f41a2512" />
  Regsiter page :
  <img width="1667" height="1015" alt="image" src="https://github.com/user-attachments/assets/8cbc9379-daa0-4d82-aa13-eff0ffca538f" />
  Statistics page :
  <img width="1912" height="1020" alt="image" src="https://github.com/user-attachments/assets/5250142d-705c-41ca-b3a7-201d54dd9b83" /> 

- After
  
  sign in page :
  <img width="967" height="778" alt="image" src="https://github.com/user-attachments/assets/5cc32f4d-4203-41e5-a984-040f67bb1350" />
  register page :
  <img width="986" height="986" alt="image" src="https://github.com/user-attachments/assets/8e1306ff-8fc0-4cd8-ae6e-5ab5aa373293" />
  Home page :
  <img width="1906" height="1019" alt="image" src="https://github.com/user-attachments/assets/f3f3d9a5-142f-45cd-ba76-9dd5b958c004" />
  Statistics Page :
  <img width="826" height="486" alt="image" src="https://github.com/user-attachments/assets/db3d1d5e-0f48-40dd-809c-8d5db5a8f9e3" />

### Live Demo :


### Performance Considerations
Reduced unnecessary React re-renders
Used lightweight styling approach (no heavy CSS frameworks)
Efficient handling of hover effects using DOM manipulation
Maintained fast load times




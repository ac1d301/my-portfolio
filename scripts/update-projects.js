const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '..', 'content', 'projects');

// Read all files in the projects directory
fs.readdir(projectsDir, (err, files) => {
  if (err) {
    console.error('Error reading projects directory:', err);
    return;
  }

  // Filter for .mdx files
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));
  
  mdxFiles.forEach((file, index) => {
    const filePath = path.join(projectsDir, file);
    const projectNum = index + 1;
    
    const content = `---
title: "Project ${projectNum}"
description: "A brief description of Project ${projectNum} and its key features."
date: "2023-01-01"
url: "#"
published: false
repository: "username/project-${projectNum}"
---

![Project ${projectNum}](/placeholder-project.png)

Project ${projectNum} is a sample project that demonstrates key features and functionality. This is a placeholder description that should be replaced with actual project details.

## Features

- Feature 1
- Feature 2
- Feature 3

## Technologies Used

- Technology 1
- Technology 2
- Technology 3`;

    // Write the updated content back to the file
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(`Error updating ${file}:`, err);
      } else {
        console.log(`Updated ${file}`);
      }
    });
  });
});

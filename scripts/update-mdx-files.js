const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '..', 'content', 'projects');
const files = fs.readdirSync(projectsDir).filter(file => file.endsWith('.mdx'));

const placeholderContent = `---
title: "Project Title"
description: "Description goes here"
published: false
repository: "#"
---

# Project Title

Project description and details go here.`;

files.forEach(file => {
  const filePath = path.join(projectsDir, file);
  fs.writeFileSync(filePath, placeholderContent, 'utf8');
  console.log(`Updated: ${file}`);
});

console.log('\nAll project files have been updated with placeholder content.');

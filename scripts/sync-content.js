#!/usr/bin/env node

/**
 * Sync CMS Content to JSON
 * Converts markdown files from content/ to JSON in data/
 */

const fs = require('fs');
const path = require('path');

// Try to load js-yaml with error handling
let yaml;
try {
  yaml = require('js-yaml');
  console.log('✓ js-yaml loaded successfully');
} catch (error) {
  console.error('❌ Error loading js-yaml:', error.message);
  console.error('Make sure to run: npm install');
  process.exit(1);
}

// Function to parse markdown with frontmatter
function parseMarkdown(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (error) {
    console.error('Error parsing YAML:', error.message);
    return null;
  }
}

// Main execution wrapped in try-catch
try {
  console.log('🚀 Starting CMS content sync...\n');

// ========== SLIDER CONTENT ==========
console.log('📊 Processing slider content...');

const sliderDir = 'content/slider';
const slides = [];

if (fs.existsSync(sliderDir)) {
  const files = fs.readdirSync(sliderDir)
    .filter(f => f.endsWith('.md'))
    .sort();
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(sliderDir, file), 'utf8');
    const data = parseMarkdown(content);
    if (data) {
      slides.push(data);
      console.log(`  ✓ Processed slide: ${file}`);
    }
  });
}

// Write slides to JSON
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/slides.json', JSON.stringify(slides, null, 2));
console.log(`✅ Converted ${slides.length} slides to JSON\n`);

// ========== PAGE CONTENT ==========
console.log('📄 Processing page content...');

const pagesDir = 'content/pages';
const pageContent = {};

if (fs.existsSync(pagesDir)) {
  const pageFiles = {
    'home.md': 'home',
    'services-individual.md': 'services_individual',
    'services-organizations.md': 'services_organizations',
    'approach.md': 'approach',
    'about.md': 'about',
    'contact.md': 'contact'
  };
  
  Object.entries(pageFiles).forEach(([filename, key]) => {
    const filePath = path.join(pagesDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = parseMarkdown(content);
      if (data) {
        pageContent[key] = data;
        console.log(`  ✓ Processed page: ${filename}`);
      }
    } else {
      console.log(`  ⚠ Page not found: ${filename}`);
    }
  });
}

// Write page content to JSON
fs.writeFileSync('data/content.json', JSON.stringify(pageContent, null, 2));
console.log(`✅ Converted ${Object.keys(pageContent).length} pages to JSON\n`);

console.log('🎉 All content synced successfully!');

} catch (error) {
  console.error('\n❌ Fatal error during sync:');
  console.error(error);
  process.exit(1);
}


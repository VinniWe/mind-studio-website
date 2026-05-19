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

// Write DE slides to JSON
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/slides.json', JSON.stringify(slides, null, 2));
console.log(`✅ Converted ${slides.length} DE slides to JSON\n`);

// ========== EN SLIDER CONTENT ==========
console.log('🇬🇧 Processing EN slider content...');

const enSliderDir = 'content/slider/en';
const enSlides = [];

if (fs.existsSync(enSliderDir)) {
  const enFiles = fs.readdirSync(enSliderDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  enFiles.forEach(file => {
    const content = fs.readFileSync(path.join(enSliderDir, file), 'utf8');
    const data = parseMarkdown(content);
    if (data) {
      enSlides.push(data);
      console.log(`  ✓ Processed EN slide: ${file}`);
    }
  });
}

fs.writeFileSync('data/slides-en.json', JSON.stringify(enSlides, null, 2));
console.log(`✅ Converted ${enSlides.length} EN slides to JSON\n`);

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
    'contact.md': 'contact',
    'settings.md': 'settings'
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

// ========== EN PAGE CONTENT ==========
console.log('🇬🇧 Processing EN page content...');

const enPagesDir = 'content/pages/en';
const enPageFiles = {
  'home.md': 'home',
  'services-individual.md': 'services_individual',
  'services-organizations.md': 'services_organizations',
  'approach.md': 'approach',
  'about.md': 'about',
  'contact.md': 'contact',
  'settings.md': 'settings'
};

const enContent = {};
if (fs.existsSync(enPagesDir)) {
  Object.entries(enPageFiles).forEach(([filename, key]) => {
    const filePath = path.join(enPagesDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = parseMarkdown(content);
      if (data) {
        enContent[key] = data;
        console.log(`  ✓ Processed EN page: ${filename}`);
      }
    } else {
      console.log(`  ⚠ EN page not found: ${filename}`);
    }
  });
}

pageContent.en = enContent;
console.log(`✅ Converted ${Object.keys(enContent).length} EN pages to JSON\n`);

// Write page content to JSON
fs.writeFileSync('data/content.json', JSON.stringify(pageContent, null, 2));
console.log(`✅ Total pages in content.json: ${Object.keys(pageContent).length} (incl. EN)\n`);

console.log('🎉 All content synced successfully!');

} catch (error) {
  console.error('\n❌ Fatal error during sync:');
  console.error(error);
  process.exit(1);
}


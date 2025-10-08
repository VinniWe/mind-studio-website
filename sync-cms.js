#!/usr/bin/env node
/**
 * Sync CMS Content to JSON
 * Converts markdown files in content/ to JSON files in data/
 */

const fs = require('fs');
const path = require('path');

// Simple YAML parser for frontmatter
function parseYAML(text) {
  const obj = {};
  const lines = text.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes
    value = value.replace(/^["']|["']$/g, '');
    
    // Parse booleans
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Parse numbers
    else if (!isNaN(value) && value !== '') value = Number(value);
    // Empty string
    else if (value === '') value = '';
    
    obj[key] = value;
  }
  
  return obj;
}

// Parse markdown file with frontmatter
function parseMarkdown(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  return parseYAML(match[1]);
}

// Convert slider markdown to JSON
function syncSlider() {
  const sliderDir = path.join(__dirname, 'content/slider');
  const slides = [];
  
  if (!fs.existsSync(sliderDir)) {
    console.log('⚠️  Slider directory not found');
    return;
  }
  
  const files = fs.readdirSync(sliderDir)
    .filter(f => f.endsWith('.md'))
    .sort();
  
  console.log(`📁 Found ${files.length} markdown files`);
  
  files.forEach(file => {
    const filepath = path.join(sliderDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    const data = parseMarkdown(content);
    
    if (data) {
      slides.push(data);
      console.log(`  ✅ ${file} → ${data.title}`);
    }
  });
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write JSON file
  const outputPath = path.join(dataDir, 'slides.json');
  fs.writeFileSync(outputPath, JSON.stringify(slides, null, 2));
  
  console.log(`\n✅ Created ${outputPath} with ${slides.length} slides`);
}

// Run sync
console.log('🔄 Syncing CMS content to JSON...\n');
syncSlider();
console.log('\n🎉 Sync complete!');


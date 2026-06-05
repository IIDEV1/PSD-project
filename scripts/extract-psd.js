const fs = require('fs');
const path = require('path');
const PSD = require('psd');

const inputPath = process.argv[2];
const outputDir = process.argv[3] || path.join(process.cwd(), 'artifacts');

if (!inputPath) {
  console.error('Usage: node scripts/extract-psd.js <input.psd> [outputDir]');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const psd = PSD.fromFile(inputPath);
psd.parse();

const tree = psd.tree();
function simplifyNode(node) {
  const exportNode = node.export();
  const simplified = {
    type: exportNode.type,
    name: exportNode.name,
    visible: exportNode.visible,
    opacity: exportNode.opacity,
    left: exportNode.left,
    top: exportNode.top,
    width: exportNode.width,
    height: exportNode.height,
  };

  if (exportNode.text && exportNode.text.value) {
    simplified.text = exportNode.text.value;
  }

  if (node.children && node.children().length) {
    simplified.children = node.children().map(simplifyNode);
  }

  return simplified;
}

const exportData = {
  file: inputPath,
  document: psd.header,
  children: tree.children().map(simplifyNode),
};

fs.writeFileSync(
  path.join(outputDir, 'layers.json'),
  JSON.stringify(exportData, null, 2),
  'utf8'
);

const image = psd.image.toPng();
const stream = fs.createWriteStream(path.join(outputDir, 'preview.png'));

image.pack().pipe(stream);
stream.on('finish', () => {
  console.log(`Exported preview and layers to ${outputDir}`);
});

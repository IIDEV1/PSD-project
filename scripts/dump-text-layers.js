const fs = require('fs');
const path = require('path');
const PSD = require('psd');

const psd = PSD.fromFile(path.join(process.cwd(), 'main.psd'));
psd.parse();

function collect(node, section, output) {
  const exported = node.export();
  if (exported.text && exported.text.value) {
    output.push({
      section,
      name: exported.name,
      left: exported.left,
      top: exported.top,
      width: exported.width,
      height: exported.height,
      text: exported.text.value.replace(/\r/g, '\n'),
      font: exported.text.font,
    });
  }

  if (node.children) {
    for (const child of node.children()) {
      collect(child, section, output);
    }
  }
}

const output = [];
for (const sectionNode of psd.tree().children()) {
  collect(sectionNode, sectionNode.name, output);
}

const outPath = path.join(process.cwd(), 'artifacts', 'text-layers.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Saved ${output.length} text layers to ${outPath}`);

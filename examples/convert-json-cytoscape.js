const fs = require('node:fs');
try {
    const data = fs.readFileSync('./example-prod.json', 'utf8');
    const json = JSON.parse(data);
    const nodes = json.elements.nodes;
    const edges = json.elements.edges;

    let counter = 1;
    const simpleNodes = nodes.map(n => {
        counter++;
        return {
            id: n.data.id,
            label: counter.toString()
        }
    });

    const simpleEdges = edges.map(e => {
        return {
            id: e.data.id,
            source:e.data.source,
            target: e.data.target
        }
    });

    const newExample = {
        nodes:simpleNodes, edges:simpleEdges
    }


    console.log(JSON.stringify(newExample));
} catch (err) {
    console.error(err);
}
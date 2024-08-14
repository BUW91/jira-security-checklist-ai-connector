function convertToReadableContent(node) {
    let content = '';

    if (node.type === 'text') {
        content += applyMarks(node.text, node.marks);
    }

    if (node.type === 'emoji') {
        content += node.attrs.text;
    }

    if (node.type === 'date') {
        const date = new Date(parseInt(node.attrs.timestamp));
        content += date.toDateString();
    }

    if (node.type === 'status') {
        content += `[Status: ${node.attrs.text} (${node.attrs.color})]`;
    }

    if (node.content) {
        for (let child of node.content) {
            content += convertToReadableContent(child);
        }
    }

    if (node.type === 'heading') {
        content = '\n' + '#'.repeat(node.attrs.level) + ' ' + content + '\n';
    }

    if (node.type === 'paragraph') {
        content = '\n' + content + '\n';
    }

    if (node.type === 'bulletList') {
        content = '\n' + content + '\n';
    }

    if (node.type === 'orderedList') {
        content = '\n' + content + '\n';
    }

    if (node.type === 'listItem') {
        if (node.attrs && node.attrs.order) {
            content = `\n${node.attrs.order}. ` + content + '\n';
        } else {
            content = '\n- ' + content + '\n';
        }
    }

    if (node.type === 'panel') {
        content = `\n[${node.attrs.panelType} Panel]\n` + content + '\n';
    }

    if (node.type === 'blockquote') {
        content = `\n> ${content}\n`;
    }

    if (node.type === 'rule') {
        content = '\n---\n';
    }

    if (node.type === 'codeBlock') {
        content = `\n\`\`\`\n${content}\n\`\`\`\n`;
    }

    if (node.type === 'table') {
        content += '\n<table>\n';
        node.content.forEach(row => {
            content += '  <tr>\n';
            row.content.forEach(cell => {
                const cellType = cell.type === 'tableHeader' ? 'th' : 'td';
                content += `    <${cellType}>` + convertToReadableContent(cell) + `</${cellType}>\n`;
            });
            content += '  </tr>\n';
        });
        content += '</table>\n';
    }
    return content;
}

function applyMarks(text, marks) {
    if (!marks) return text;

    marks.forEach(mark => {
        switch (mark.type) {
            case 'strong':
                text = `**${text}**`;
                break;
            case 'em':
                text = `_${text}_`;
                break;
            case 'underline':
                text = `<u>${text}</u>`;
                break;
            case 'strike':
                text = `~~${text}~~`;
                break;
            case 'code':
                text = `\`${text}\``;
                break;
            case 'textColor':
                text = `<span style="color:${mark.attrs.color}">${text}</span>`;
                break;
            case 'subsup':
                if (mark.attrs.type === 'sub') {
                    text = `<sub>${text}</sub>`;
                } else if (mark.attrs.type === 'sup') {
                    text = `<sup>${text}</sup>`;
                }
                break;
        }
    });
    return text;
}

module.exports = {
    convertToReadableContent
};
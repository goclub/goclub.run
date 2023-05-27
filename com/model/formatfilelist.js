function formatFilesWithHierarchy(filePaths) {
    const hierarchy = {};

    filePaths.forEach(filePath => {
        const parts = filePath.split('/');
        let currentLevel = hierarchy;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (!currentLevel[part]) {
                currentLevel[part] = {};
            }

            currentLevel = currentLevel[part];
        }
    });

    return hierarchy;
}

function convertToTreeData(obj, path = '') {
    const treeData = [];

    for (const key in obj) {
        const fullPath = path ? `${path}/${key}` : key;
        const node = {
            key: fullPath, // 添加 key 属性
            label: key,
            value: fullPath
        };

        if (Object.keys(obj[key]).length > 0) {
            node.children = convertToTreeData(obj[key], fullPath);
        }

        treeData.push(node);
    }

    return treeData;
}


export default function (a) {
    var o = convertToTreeData(formatFilesWithHierarchy(a))
    return o
}
import fs from "node:fs/promises"
import path from "node:path"
import type {PlopTypes} from "@turbo/gen"

type ReplaceTokensActionConfig = PlopTypes.ActionConfig & {
    /**
     * Optional: skip certain directories by name.
     */
    ignoreDirNames?: string[];
    packageName: string;
    destination: string;
};

function isProbablyBinary(buffer: Buffer): boolean {
    // Heuristic: if it contains a NUL byte, treat as binary
    return buffer.includes(0)
}

async function walk(dir: string, ignoreDirNames: Set<string>): Promise<string[]> {
    const entries = await fs.readdir(dir, {withFileTypes: true})
    const files: string[] = []

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (ignoreDirNames.has(entry.name)) continue
            files.push(...(await walk(path.join(dir, entry.name), ignoreDirNames)))
        } else if (entry.isFile()) {
            files.push(path.join(dir, entry.name))
        }
    }

    return files
}

async function replaceInFiles(opts: ReplaceTokensActionConfig, dir: string, packageName: string): Promise<number> {
    const absDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir)
    const ignoreDirNames = new Set(opts.ignoreDirNames ?? ["node_modules", ".git", ".turbo", "dist", "build"])

    const files = await walk(absDir, ignoreDirNames)
    let changedCount = 0

    for (const filePath of files) {
        const buf = await fs.readFile(filePath)
        if (isProbablyBinary(buf)) continue

        const original = buf.toString("utf8")
        let next = original

        next = next.split("{{name}}").join(packageName)

        if (next !== original) {
            await fs.writeFile(filePath, next, "utf8")
            changedCount++
        }
    }

    return changedCount
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    // Custom action: replace literal tokens across a directory
    plop.setActionType("replace-tokens", async (answers, config) => {
        const cfg = config as ReplaceTokensActionConfig

        const destination = plop.renderString(String(cfg.destination), answers)
        const packageName = plop.renderString(String(cfg.packageName), answers)

        const changed = await replaceInFiles(cfg, destination, packageName)
        return `Replaced tokens in ${changed} file(s) under ${destination}`
    })

    plop.setGenerator("replace-name", {
        description: "Replace all {{name}} occurrences",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Workspace name:",
                validate: (v: string) => (v?.trim().length ? true : "Name is required"),
            },
        ],
        actions: [
            {
                type: "replace-tokens",
                packageName: "{{ name }}",
                destination: "{{ turbo.paths.root }}/packages/{{ name }}"
            } as ReplaceTokensActionConfig,
        ],
    })
}

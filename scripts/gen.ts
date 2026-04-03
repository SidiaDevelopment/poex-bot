import { execa } from "execa"
import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"

const { name } = yargs(hideBin(process.argv))
    .option("name", {
        type: "string",
        demandOption: true,
        describe: "Package name"
    })
    .parseSync()

const run = async () => {
    await execa(
        "turbo",
        ["gen", "workspace", "--copy", "@kadeki/package-template", "--name", `@kadeki/${name}`, "--type", "package"],
        { stdio: "inherit" }
    )

    await execa(
        "turbo",
        ["gen", "replace-name", "--args", name],
        { stdio: "inherit" }
    )
}

run()

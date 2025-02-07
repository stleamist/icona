import type { GenerateDrawableConfig, IconaIconData } from "@icona/types";
import {
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { writeFileSync } from "fs";
import { resolve } from "path";
import svg2vectordrawable from "svg2vectordrawable";

interface GenerateDrawableFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GenerateDrawableConfig;
}

export const generateDrawable = ({
  icons = getIconaIconsFile(),
  config,
}: GenerateDrawableFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "drawable";
  const drawableConfig = config.svg2vectordrawableConfig || {};
  const defaultColor = config.defaultColor;

  if (!icons) {
    throw new Error("There is no icons data");
  }

  // TODO: Name transform option
  Object.entries(icons).forEach(async ([name, data]) => {
    const { svg } = data;
    makeFolderIfNotExistFromRoot(path);

    const drawablePath = resolve(projectPath, path, `${name}.xml`);
    let drawable = await svg2vectordrawable(svg, drawableConfig);

    // NOTE(@junghyeonsu): DRAWABLE_DEFAULT_COLOR = "#FF212124"
    if (defaultColor) {
      drawable = drawable.replace(/#FF212124/g, defaultColor);
    }

    writeFileSync(drawablePath, drawable);
  });
};

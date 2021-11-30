/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import { EOL } from 'os';
import { EmitHint, ExportDeclaration, factory } from 'typescript';
import {
  FrontendManagerTemplateRenderer,
  FrontendManagerTheme,
  FrontendManagerComponent,
} from '@aws-amplify/codegen-ui';
import { ReactRenderConfig, scriptKindToFileExtensionNonReact } from './react-render-config';
import { ImportCollection } from './import-collection';
import { ReactOutputManager } from './react-output-manager';
import {
  transpile,
  buildPrinter,
  defaultRenderConfig,
  getDeclarationFilename,
} from './react-frontend-manager-template-renderer-helper';
import { RequiredKeys } from './utils/type-utils';

type FrontendManagerSchema = FrontendManagerComponent | FrontendManagerTheme;

export class ReactIndexFrontendManagerTemplateRenderer extends FrontendManagerTemplateRenderer<
  string,
  FrontendManagerSchema[],
  ReactOutputManager,
  {
    componentText: string;
    renderComponentToFilesystem: (outputPath: string) => Promise<void>;
  }
> {
  protected importCollection = new ImportCollection();

  protected renderConfig: RequiredKeys<ReactRenderConfig, keyof typeof defaultRenderConfig>;

  fileName: string;

  constructor(schemas: FrontendManagerSchema[], renderConfig: ReactRenderConfig) {
    super(schemas, new ReactOutputManager(), renderConfig);
    this.renderConfig = {
      ...defaultRenderConfig,
      ...renderConfig,
      renderTypeDeclarations: false, // Never render type declarations for index.js|ts file.
    };
    this.fileName = `index.${scriptKindToFileExtensionNonReact(this.renderConfig.script)}`;
  }

  renderComponentInternal() {
    const { printer, file } = buildPrinter(this.fileName, this.renderConfig);

    const exportStatements = this.buildExports()
      .map((exportStatement) => printer.printNode(EmitHint.Unspecified, exportStatement, file))
      .join(EOL);

    const { componentText, declaration } = transpile(exportStatements, this.renderConfig);

    return {
      componentText,
      renderComponentToFilesystem: async (outputPath: string) => {
        await this.renderComponentToFilesystem(componentText)(this.fileName)(outputPath);
        if (declaration) {
          await this.renderComponentToFilesystem(declaration)(getDeclarationFilename(this.fileName))(outputPath);
        }
      },
    };
  }

  /*
   * export { default as MyTheme } from './MyTheme';
   * export { default as ButtonComponent } from './ButtonComponent';
   */
  private buildExports(): ExportDeclaration[] {
    return this.component
      .filter(({ name }) => name !== undefined)
      .map(({ name }) => {
        /**
         * Type checker isn't detecting that name can't be undefined here
         * including this (and return cast) to appease the checker.
         */
        if (name === undefined) {
          return undefined;
        }
        return factory.createExportDeclaration(
          undefined,
          undefined,
          false,
          factory.createNamedExports([
            factory.createExportSpecifier(factory.createIdentifier('default'), factory.createIdentifier(name)),
          ]),
          factory.createStringLiteral(`./${name}`),
        );
      }) as ExportDeclaration[];
  }
}
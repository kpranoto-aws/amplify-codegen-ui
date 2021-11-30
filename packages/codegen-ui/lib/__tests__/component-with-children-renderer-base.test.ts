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
import { ButtonProps } from '@aws-amplify/ui-react';
import { FrontendManagerComponentChild } from '../types';
import { ComponentWithChildrenRendererBase } from '../component-with-children-renderer-base';

class MockComponentRenderer extends ComponentWithChildrenRendererBase<ButtonProps, string, string> {
  renderElement(renderChildren: (children: FrontendManagerComponentChild[], component?: string) => string[]): string {
    return `${this.component.name},${renderChildren(this.component.children || []).join(',')}`;
  }
}

describe('ComponentWithChildrenRendererBase', () => {
  test('renderElement', () => {
    expect(
      new MockComponentRenderer({
        componentType: 'Button',
        name: 'MyButton',
        properties: {},
        children: [
          {
            componentType: 'Text',
            name: 'MyText',
            properties: {},
          },
        ],
      }).renderElement((children) => children.map((child) => child.name)),
    ).toEqual('MyButton,MyText');
  });
});
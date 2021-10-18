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
import { TestGenerator } from './TestGenerator';

new TestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  disabledSchemas: [
    'ComponentWithConcatenation', // TODO: Support Concatenation E2E Tests
    'ComponentWithConditional', // TODO: Support Conditional E2E Tests
    'ComponentWithDataBinding', // TODO: Support Data Binding E2E Tests
    'ComponentWithExposedAs', // TODO: Support Custom Props E2E Tests
    'CollectionBasic', // TODO: Support Collection E2E Tests
    'CollectionWithBinding', // TODO: Support Collection Binding E2E Tests
    'CollectionWithSort', // TODO: Support Collection Sorting E2E Tests
    'ComponentWithVariant', // TODO: Support Variant E2E Tests
    'ComponentWithActionSignOut', // TODO: Support Auth Action E2E Tests
    'ComponentWithActionNavigation', // TODO: Support Navigation Action E2E Tests
  ],
}).generate();
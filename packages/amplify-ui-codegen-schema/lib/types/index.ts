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
export type FigmaMetadata = {
  /**
   * The document URL for the figma document
   */
  documentUrl?: string;

  /**
   *  The nodeId generated by Figma
   */
  nodeId?: string;
};

/**
 * This is the base type for all Studio components
 */
export type StudioComponent = {
  /**
   * The name of the customized component
   */
  name?: string;

  /**
   *  This is the unique global identifier for each component
   */
  id?: string;

  /**
   * The id if the component in its source system (Figma, Sketch, etc.)
   */
  sourceId?: string;

  /**
   * This should map to the components available including Amplify
   * UI components and other custom components
   */
  componentType: string;

  /**
   * These are the customized properties
   */
  properties: StudioComponentProperties;

  /**
   * These are the nested components in a composite
   */
  children?: StudioComponentChild[];

  /**
   * The  metatdata gerated by Figma
   */
  figmaMetadata?: FigmaMetadata;

  /**
   * Variants in terms of styles
   */
  variants?: StudioComponentVariant[];

  /**
   * Overrides for primitives
   */
  overrides?: StudioComponentOverrides;

  bindingProperties: {
    [propertyName: string]:
      | StudioComponentDataPropertyBinding
      | StudioComponentAuthPropertyBinding
      | StudioComponentStoragePropertyBinding
      | StudioComponentSimplePropertyBinding
      | StudioComponentEventPropertyBinding;
  };

  /**
   * These are the collection properties
   */
  collectionProperties?: {
    [propertyName: string]: StudioComponentDataConfiguration;
  };

  /**
   * Component actions
   */
  actions?: {
    [actionName: string]: StudioComponentAction;
  };
};

/**
 * A new studio component where the componentId will automatically be generated
 */
export type NewStudioComponent = {
  /**
   * The name of the customized component
   */
  name?: string;

  /**
   * This should map to the components available including Amplify
   * UI components and other custom components
   */
  componentType: string;

  /**
   * These are the customized properties
   */
  properties: StudioComponentProperties;

  /**
   * These are the nested components in a composite
   */
  children?: StudioComponentChild[];

  /**
   * The  metatdata gerated by Figma
   */
  figmaMetadata?: FigmaMetadata;

  /**
   * Variants in terms of styles
   */
  variants?: StudioComponentVariant[];

  /**
   * Overrides for primitives
   */
  overrides?: StudioComponentOverrides;

  bindingProperties: {
    [propertyName: string]:
      | StudioComponentDataPropertyBinding
      | StudioComponentAuthPropertyBinding
      | StudioComponentStoragePropertyBinding
      | StudioComponentSimplePropertyBinding
      | StudioComponentEventPropertyBinding;
  };

  /**
   * These are the collection properties
   */
  collectionProperties?: {
    [propertyName: string]: StudioComponentDataPropertyBinding;
  };
};

export type StudioComponentSimplePropertyBinding = {
  /**
   *  This is the data type for the value that is bound to this property. The default
   * inferred type is string so this will only need to be set if it is not a string
   */
  type: keyof typeof StudioComponentPropertyType;

  defaultValue?: string | undefined;
};

/**
 * This is the child type for Studio components
 */
export type StudioComponentChild = {
  /**
   * This should map to the components available including Amplify
   * UI components and other custom components
   */
  componentType: string;

  /**
   * The unique name of the child element.
   */
  name: string;

  /**
   * These are the customized properties
   */
  properties: StudioComponentProperties;

  /**
   * These are the nested components in a composite
   */
  children?: StudioComponentChild[];

  /**
   * Event <-> Action mapping (e.g click => SignOutAction)
   * When an event is triggered, an action is executed
   */
  events?: {
    [eventName: string]: string;
  };
};

/**
 * This is used to track vairants for a single component
 */
export type StudioComponentVariant = {
  /**
   * The combination of vairants that comprise this variant
   */
  variantValues: { [key: string]: string };

  /**
   * The overridden properties for this variant
   */
  overrides: StudioComponentOverrides;
};

/**
 * This is a dictionary of overrides for a single parent component.
 * The hirearchy reference should
 */
export type StudioComponentOverrides = {
  /**
   * This is the reference to full component override hierarchy
   * @returns A set of key value pairs representing overrides for the given primitive hierarchy.
   */
  [hierarchyReference: string]: { [key: string]: string };
};

/**
 * This is a dictionary of properties. Each key represents
 * a uniquely named property of a component
 */
export type StudioComponentProperties = {
  /**
   * Each key maps to an available component property. Static values
   * can be passed in as a string.
   */
  [key: string]: StudioComponentProperty;
};

export type StudioComponentProperty =
  | FixedStudioComponentProperty
  | BoundStudioComponentProperty
  | CollectionStudioComponentProperty
  | ConcatenatedStudioComponentProperty
  | ConditionalStudioComponentProperty
  | WorkflowStudioComponentProperty
  | FormStudioComponentProperty;

/**
 * This represents a component property that is configured with either
 * static  values
 */
export type FixedStudioComponentProperty = {
  /**
   * These are the values pass when code generating. Static values can be passed in
   * as a string
   */
  value: string | number | boolean | Date;
};

/**
 * This represents a component property that is configured with either
 * data bound values
 */
export type BoundStudioComponentProperty = {
  /**
   * This is the exposed property that will propagate down to this value
   */
  bindingProperties: {
    property: string;
    field?: string;
  };

  /**
   * The default value to pass in if no prop is provided
   */
  defaultValue?: string;
};

/**
 * This represents a component property that is configured with collection item
 */
export type CollectionStudioComponentProperty = {
  /**
   * record collection item bindings
   */
  collectionBindingProperties: {
    property: string;
    field?: string;
  };

  /**
   * The default value to pass in if no prop is provided
   */
  defaultValue?: string;
};

/**
 * Component property that contains concatenation of multiple properties
 */
export type ConcatenatedStudioComponentProperty = {
  concat: StudioComponentProperty[];
};

/**
 * Component property that represents a conditional expression
 */
export type ConditionalStudioComponentProperty = {
  condition: {
    property: string;
    field: string;
    operator: string;
    operand: string | number | boolean;
    then: StudioComponentProperty;
    else: StudioComponentProperty;
  };
};

/**
 * This represents a component property that is configured with either
 * data bound values
 */
export type WorkflowStudioComponentProperty = {
  event: string;
};

/**
 * This is the configuration for a form binding. This is
 * technically an extension of Workflows but because it is
 * pretty unique, it should be separated out with its own definition
 */
export type FormStudioComponentProperty = {
  /**
   * The model of the DataStore object
   */
  model: string;

  /**
   * The binding configuration for the form
   */
  bindings: FormBindings;
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentDataConfiguration = {
  model: string;

  sort?: StudioComponentSort[];

  predicate?: StudioComponentPredicate;

  /**
   * This is a collection of Id's that will be always queried from DataStore.
   * This would be used in liu of a predicate.
   */
  identifiers?: string[];
};

export type StudioComponentSort = {
  field: string;
  direction: 'ASC' | 'DESC';
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentDataPropertyBinding = {
  /**
   * This declares where the data is coming from to bind to
   */
  type: 'Data';

  /**
   * This is the value of the data binding
   */
  bindingProperties: StudioComponentDataBindingProperty;
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentEventPropertyBinding = {
  /**
   * This declares that the type is of a workflow binding
   */
  type: 'Event';
};

export type FormBindings = {
  [key: string]: FormBindingElement;
};

export type FormBindingElement = {
  /**
   * The name of the component to fetch a value from
   */
  element: string;

  /**
   * The property component to get the value from.
   */
  property: string;
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentAuthPropertyBinding = {
  /**
   * This declares where the data is coming from to bind to
   */
  type: 'Authentication';

  /**
   * This is the value of the data binding
   */
  bindingProperties: StudioComponentAuthBindingProperty;
};

/**
 * This represent the configuration for binding a component property
 * to Amplify specific information
 */
export type StudioComponentStoragePropertyBinding = {
  /**
   * This declares where the data is coming from to bind to
   */
  type: 'Storage';

  /**
   * This is the value of the data binding
   */
  bindingProperties: StudioComponentStorageBindingProperty;
};

/**
 * These are the primitive value types
 */
export enum StudioComponentPropertyType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
}

/**
 * These are the types of data binding
 */
export enum StudioComponentPropertyBindingType {
  Data = 'Data',
  Authentication = 'Authentication',
  Storage = 'Storage',
}

/**
 * This represents the model and field you want to bind
 * a component property to
 */
export type StudioComponentDataBindingProperty = {
  model: string;
  field?: string;
  predicate?: StudioComponentPredicate;
};

export type StudioComponentPredicate = {
  and?: StudioComponentPredicate[];
  or?: StudioComponentPredicate[];
  field?: string;
  operand?: string;
  operator?: string;
};

/**
 * This represents the user attribute you want to bind a
 * Studio component property to
 */
export type StudioComponentAuthBindingProperty = {
  userAttribute: string;
};

/**
 * This represents the bucket and key you want to bind a component
 * property to
 */
export type StudioComponentStorageBindingProperty = {
  bucket: string;
  key?: string;
};

export type StudioTheme = {
  name: string;
  id?: string;
  values: StudioThemeValues;
  // overrides is a special case becuase it is an array of values
  overrides?: StudioThemeValues[];
};

export type StudioThemeValues = {
  [token: string]: StudioThemeValue;
};

export type StudioThemeValue = {
  value?: string;
  children?: StudioThemeValues;
};

/**
 * Component action types
 */
export type StudioComponentAction = AmplifyAuthSignOutAction | NavigationAction;

/**
 * Amplify Auth signout Action type
 */
export type AmplifyAuthSignOutAction = {
  type: 'Amplify.Auth.SignOut';
  parameters?: {
    global: boolean;
  };
};

/**
 * Navigation related action types.
 */
export type NavigationAction =
  | NavigationRedirectAction
  | NavigationOpenAction
  | NavigationRefreshAction;

/**
 * Redirect action type
 */
export type NavigationRedirectAction = {
  type: 'Navigation.Redirect';
  parameters: {
    href: string;
    replaceHistory?: boolean; // Default to false
  }
};

/**
 * Redirect action type
 */
 export type NavigationOpenAction = {
  type: 'Navigation.Open';
  parameters: {
    href: string;
  }
};

export type NavigationRefreshAction = {
  type: 'Navigation.Refresh';
};
